const accountId = props.accountId || context.accountId;
const contract = "mint.yearofchef.near";
const marketId = "simple.market.mintbase1.near";

const AFFILIATE_ACCOUNT = props.affiliateAccount || "mintbase.near";
const [page, setPage] = useState(0);

const data = fetch("https://graph.mintbase.xyz", {
  method: "POST",
  headers: {
    "mb-api-key": "anon",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query MyQuery {
      mb_views_nft_tokens(
        where: {nft_contract_id: {_eq: "mint.yearofchef.near"}}
        order_by: {token_id: asc}
      ) {
        token_id
        title
        owner
        media
        metadata_id
        listings {
          price
        }
      }
      mb_views_nft_owned_tokens_aggregate(
        distinct_on: owner
        where: {nft_contract_id: {_eq: "mint.yearofchef.near"}}
      ) {
        aggregate {
          count(distinct: true)
        }
      }
    }
    
  `,
  }),
});
const nfts = data?.body?.data?.mb_views_nft_tokens;
const owners =
  data?.body?.data?.mb_views_nft_owned_tokens_aggregate?.aggregate.count;
const YoctoToNear = (amountYocto) => {
  return new Big(amountYocto || 0).div(new Big(10).pow(24)).toString();
};

let buy = (price, token_id) => {
  const gas = 200000000000000;
  const deposit = new Big(price).toFixed(0);
  Near.call(
    marketId,
    "buy",
    {
      nft_contract_id: contract,
      token_id: token_id,
    },
    gas,
    deposit
  );
};

if (!data.ok) {
  return "Loading";
}

const size = "20em";
const NFTcard = styled.a`
  display: flex;
  width: 250px;
  flex-direction: column;
  border: 2px solid #ec2109;
  border-radius: 10px;
  box-shadow: 0px 0px 5px #ec20096b;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  overflow: hidden;
  text-decoration: none;
  height: 100%;
  :hover {
    box-shadow: 0px 0px 20px #ec20096b;
    text-decoration: none;
  }
  img {
    height: 250px;
    object-fit: cover;
    position: relative;
    :before {
      content: " ";
      display: block;
      position: absolute;
      height: 250px;
      width: 250px;
      background-image: url("https://image-cache-service-z3w7d7dnea-ew.a.run.app/small?url=https://ipfs.io/ipfs/QmYF3z6rGwRVRGHfWzRpd9QQQKTcA3zfNkBkkgw3kwmCbW");
    }
  }
  .desc {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 1rem;
  }
  .tile {
    color: black;
  }
  .listed {
    font-size: 10px;
    color: #6c757d;
    margin-left: auto;
  }
  .price {
    font-size: 12px;
    color: #ec2109;
    margin-left: auto;
    font-weight: bold;
  }
`;

const Pagination = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  div {
    border: 1px solid transparent;
    background: #ec2109;
    border-radius: 2px;
    padding: 10px;
    font-size: 12px;
    color: white;
    cursor: pointer;
    :hover {
      background: #ec200975;
    }
    &.active {
      background: white;
      color: #ec2109;
      border-color: #ec2109;
    }
  }
`;
const Stats = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  .vertical-line {
    width: 2px;
    height: 100%;
    background: rgb(236, 33, 9);
  }
`;
const Total = styled.div`
  font-size: 20px;
  flex-direction: column;
  text-align: center;
  div:last-child {
    color: #ec2109;
    font-weight: 600;
  }
`;

// Paginaton
const perPage = 50;
// list of pages
const paginations = [...Array(parseInt(nfts?.length / perPage) + 1).keys()];

let lastElement = paginations[paginations.length - 1];
const handlePainate = (to) => {
  if (to !== "...") {
    setPage(parseInt(to));
  }
};
const Page = ({ children }) => {
  return (
    <div
      onClick={() => handlePainate(children[0])}
      className={`${children[0] + "" == page + "" ? "active" : ""}`}
    >
      {children[0]}
    </div>
  );
};
const Number = () => {
  if (page === 0) {
    return (
      <Pagination>
        <Page>0</Page>
        <Page>{page + 1}</Page>
        <Page>...</Page>
        <Page>{lastElement}</Page>
      </Pagination>
    );
  } else if (page === lastElement) {
    return (
      <Pagination>
        <Page>0</Page>
        <Page>...</Page>
        <Page>{page - 1}</Page>
        <Page>{page}</Page>
      </Pagination>
    );
  } else if (page + 1 === lastElement) {
    return (
      <Pagination>
        <Page>0</Page>
        <Page>...</Page>
        <Page>{page - 1}</Page>
        <Page>{page}</Page>
        <Page>{lastElement}</Page>
      </Pagination>
    );
  } else if (page + 1 < lastElement && page > 3) {
    return (
      <Pagination>
        <Page>0</Page>
        <Page>...</Page>
        <Page>{page - 1}</Page>
        <Page>{page}</Page>
        <Page>{page + 1}</Page>
        <Page>...</Page>
        <Page>{lastElement}</Page>
      </Pagination>
    );
  } else if (page < lastElement) {
    return (
      <Pagination>
        <Page>0</Page>
        <Page>{page}</Page>
        <Page>{page + 1}</Page>
        <Page>...</Page>
        <Page>{lastElement}</Page>
      </Pagination>
    );
  }
};

return nfts.length > 0 ? (
  <>
    <Stats>
      <Total>
        <div> Total</div> <div>{nfts.length}</div>
      </Total>
      <div className="vertical-line" />
      <Total>
        <div> Owners</div> <div>{owners}</div>
      </Total>
    </Stats>
    <div className="d-flex gap-4 flex-wrap">
      {nfts.slice(page * perPage, (page + 1) * perPage).map((nft) => {
        let priceYocto = nft.listings[0].price;
        if (priceYocto) {
          priceYocto = priceYocto
            .toLocaleString()
            .replace(/,/g, "")
            .replace(/\s/g, "");
        }
        const priceNear = YoctoToNear(priceYocto);
        return (
          <div className="d-flex flex-column wrap gap-1 w-15 p-3">
            <NFTcard
              href={`https://mintbase.xyz/meta/${nft.metadata_id.replace(
                ":",
                "%3A"
              )}`}
              target="_blank"
            >
              <img
                src={
                  "https://image-cache-service-z3w7d7dnea-ew.a.run.app/media?url=" +
                  nft.media
                }
                alt={nft.title}
              />
              <div className="desc">
                <div className="tile">{nft.title}</div>
                {!priceYocto && <div className="listed">not listed</div>}
                {priceYocto && (
                  <button
                    disabled={!accountId}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!accountId) return;
                      buy(priceYocto, nft.token_id);
                    }}
                    className="btn-main"
                    style={{
                      width: "100%",
                      textAlign: "cetner",
                    }}
                  >
                    Buy {priceNear} N
                  </button>
                )}
              </div>
            </NFTcard>
          </div>
        );
      })}
    </div>
    {<Number />}
  </>
) : (
  <p>loading...</p>
);
