const accountId = props.accountId || context.accountId;
const contract = "nft.yearofchef.near";
const marketId = "simple.market.mintbase1.near";

const AFFILIATE_ACCOUNT = props.affiliateAccount || "mintbase.near";
const [data, setData] = useState([]);

useEffect(() => {
  asyncFetch("https://graph.mintbase.xyz", {
    method: "POST",
    headers: {
      "mb-api-key": "anon",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query GetStoreNfts( 
      $offset: Int = 0 $condition: mb_views_nft_metadata_unburned_bool_exp ) 
      @cached 
      { mb_views_nft_metadata_unburned( where: $condition 
        offset: $offset order_by: { title: asc } ) 
       { createdAt: minted_timestamp 
         listed: price 
         media 
         storeId: nft_contract_id 
         metadataId: metadata_id 
         title base_uri 
         description
         title
       } 
      mb_views_nft_metadata_unburned_aggregate(where: $condition) 
      { 
        aggregate { 
          count 
        } 
       } 
     }
  `,
      variables: {
        condition: {
          nft_contract_id: {
            _in: contract,
          },
        },
      },
    }),
  }).then((data) => {
    const nfts = data.body.data.mb_views_nft_metadata_unburned;
    console.log(data);
    setData(nfts);
  });
}, []);

const YoctoToNear = (amountYocto) => {
  return new Big(amountYocto || 0).div(new Big(10).pow(24)).toString();
};

let buy = (price, token_id, nft_contract_id) => {
  const gas = 200000000000000;
  const deposit = new Big(price).toFixed(0);

  Near.call(
    marketId,
    "buy",
    {
      nft_contract_id: nft_contract_id,
      token_id: token_id,
      referrer_id: AFFILIATE_ACCOUNT,
    },
    gas,
    deposit
  );
};

if (!data.ok) {
  return "Loading";
}

const size = "20em";
console.log(data);
return (
  // data !== null ? (
  <>
    <div className="d-flex gap-4 flex-wrap">
      {data?.slice(0, 4).map((listing, i) => {
        const priceYocto = listing.price
          .toLocaleString()
          .replace(/,/g, "")
          .replace(/\s/g, "");
        const priceNear = YoctoToNear(priceYocto);

        return (
          <div className="d-flex flex-column gap-1 w-15 p-3">
            <a
              href={`https://mintbase.xyz/meta/${listing.metadata_id}/`}
              target="_blank"
            >
              <Widget
                src="mob.near/widget/NftImage"
                props={{
                  nft: {
                    tokenId: listing.token_id,
                    contractId: listing.nft_contract_id,
                  },
                  style: {
                    width: size,
                    height: size,
                    objectFit: "cover",
                    minWidth: size,
                    minHeight: size,
                    maxWidth: size,
                    maxHeight: size,
                    overflowWrap: "break-word",
                  },
                  className: "",
                  fallbackUrl:
                    "https://ipfs.near.social/ipfs/bafkreihdiy3ec4epkkx7wc4wevssruen6b7f3oep5ylicnpnyyqzayvcry",
                }}
              />
            </a>
            <button
              disabled={!accountId}
              onClick={() => {
                if (!accountId) return;
                buy(priceYocto, listing.token_id, listing.nft_contract_id);
              }}
              className="btn-main"
              style={{
                width: "100%",
                textAlign: "cetner",
              }}
            >
              Buy {priceNear} N
            </button>
          </div>
        );
      })}
    </div>
    {JSON.stringify(data)}
    <div class="py-4">
      <Widget src="mintbase.near/widget/BuiltWithMintbase" />
    </div>
  </>
);
// ) : (
//   <p>loading...</p>
// );
