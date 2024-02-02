const accountId = context.accountId;
const counter = 2030;

if (!accountId) {
  return "Please sign in with NEAR wallet";
}
// const nfts = Near.view(contractId, "nft_tokens");
// Market Contract
const tradeportmarket = "market.tradeport.near";
const genadropmarket = "market.genadrop.near";
const defaultCustomMarket = "apollo42.near";
const mintbasemarket = "simple.market.mintbase1.near";
const parasmarket = "marketplace.paras.near";

// market icons
const marketIcons = {
  Paras: "bafkreigei3gwjybqb52xfdcbkc5a2eizfeil2u2rkkvzmedwmxz7ncu5fa",
  Mintbase: "bafkreichfuhgaiz74mrrestwowz2dfnzd6yhn3ecu4bal2abe2qxobo5va",
  Genadrop: "bafkreia5tclx5pt2h6jk2mcf2jsmi7zarzgwoivyozpohexekzldax7v6m",
  Tradeport: "bafkreigz4cytm5z5iqqkmx3bl4j7r2ti7yetxb4hi6a7xajyyijforluna",
};

const [state, setState] = useState({
  price: "",
  selectedNft: null,
  mintbaseMarketId: "",
  title: "name",
  imageUrl: "",
  owner: "owner",
  description: "description",
});

const { marketToList, price, selectedNft, mintbaseMarketId } = state;
const contractId = "mint.yearofchef.near";
const tokenId = selectedNft?.tokenId || "";

const updateState = (update) => {
  setState({ ...state, ...update });
};

// market links
function fetchMintbaseURL() {
  asyncFetch("https://graph.mintbase.xyz/mainnet", {
    method: "POST",
    headers: {
      "mb-api-key": "omni-site",
      "Content-Type": "application/json",
      "x-hasura-role": "anonymous",
    },
    body: JSON.stringify({
      query: `
        query MyQuery {
        nft_listings(where: {token_id: {_eq: "${tokenId}"}}) {
      	metadata_id
      }
    }
      `,
    }),
  }).then((data) => {
    if (data.body.data.nft_listings?.length) {
      updateState({
        mintbaseMarketId: data.body.data.nft_listings[0].metadata_id,
      });
    }
  });
}
fetchMintbaseURL();
const mintBaseLink = `https://www.mintbase.xyz/meta/${mintbaseMarketId}`;
const parasLink = `https://paras.id/token/${contractId}::${tokenId}`;
const tradeportLink = `https://www.tradeport.xyz/near/collection/${contractId}?tab=items&tokenId=${tokenId}`;

console.log(mintBaseLink);

// Price in YoctoNear
const _price = (price) =>
  Number(Number(new Big(price).mul(new Big(10).pow(24)).toString()))
    .toLocaleString()
    .replace(/,/g, "");
// msg arg
const trpMsg = () =>
  JSON.stringify({
    price: _price(price),
    market_type: "sale",
    ft_token_id: "near",
  });

const msg = () =>
  JSON.stringify({
    price: _price(price),
  });

const ipfsUrl = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

const data = fetch("https://graph.mintbase.xyz", {
  method: "POST",
  headers: {
    "mb-api-key": "omni-site",
    "Content-Type": "application/json",
    "x-hasura-role": "anonymous",
  },
  body: JSON.stringify({
    query: `
    query MyQuery {
      mb_views_nft_owned_tokens(where: {owner: {_eq: "${accountId}"}, nft_contract_id: {_eq: "mint.yearofchef.near"}}) {
        tokenId: token_id
        media
      }
    }    
    `,
  }),
});
console.log(data);

const nfts = data.body?.data?.mb_views_nft_owned_tokens;

const handleList = () => {
  if (!selectedNft) return console.log("select nft to list");
  if (!parseFloat(price)) return console.log("enter a price");
  // need to buffer serialize arguments, add helper functions with state arguments
  const gas = 1e14; // 100 tGas
  //   const deposit = 1; // exactly 1 yocto
  const deposit = 1e22; // 0.01 near
  const tokenId = selectedNft.tokenId;
  const contractId = contractId;
  Near.call([
    // tradeport
    {
      contractName: tradeportmarket,
      methodName: "storage_deposit",
      args: {
        receiver_id: accountId,
      },
      gas,
      deposit: deposit,
    },
    {
      contractName: contractId,
      // need to wrap first with near_deposit
      methodName: "nft_approve",
      args: {
        token_id: tokenId,
        account_id: tradeportmarket,
        msg: trpMsg(),
      },
      gas: gas,
      deposit: deposit,
    },
    // mintbasemarket
    {
      contractName: mintbasemarket,
      methodName: "deposit_storage",
      args: {
        receiver_id: accountId,
      },
      gas,
      deposit: deposit,
    },
    {
      contractName: contractId,
      // need to wrap first with near_deposit
      methodName: "nft_approve",
      args: {
        token_id: tokenId,
        account_id: mintbasemarket,
        msg: msg(),
      },
      gas: gas,
      deposit: 8e20, // may take this out
    },
    //genadropmarket
    {
      contractName: genadropmarket,
      methodName: "deposit_storage",
      args: {
        receiver_id: accountId,
      },
      gas,
      deposit: deposit,
    },
    {
      contractName: contractId,
      // need to wrap first with near_deposit
      methodName: "nft_approve",
      args: {
        token_id: tokenId,
        account_id: genadropmarket,
        msg: msg(),
      },
      gas: gas,
      deposit: deposit, // may take this out
    },
    // parasmarket
    {
      contractName: parasmarket,
      methodName: "storage_deposit",
      args: {
        receiver_id: accountId,
      },
      gas,
      deposit: 859e19,
    },
    {
      contractName: contractId,
      // need to wrap first with near_deposit
      methodName: "nft_approve",
      args: {
        token_id: tokenId,
        account_id: parasmarket,
        msg: trpMsg(), // need to add the variables and buffer seerailize
      },
      gas: gas,
      deposit: 4e20, // may take this out
    },
  ]);
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 80px;
  margin-top: 2rem;
  .nft-preview {
    width: 100%;
    height: 30rem;
    object-fit: cover;
    border-radius: 1rem;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const NFTs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  div {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 300ms cubic-bezier(0.39, 0.575, 0.565, 1);
    :hover {
      border-color: #ec2109;
    }
    &.selected {
      border-color: #ec2109;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Form = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  .label {
    font-weight: bold;
    margin: 1rem 0 4px;
  }
  .price {
    display: flex;
    align-items: center;
    gap: 1rem;
    input {
      width: 5rem;
      :focus {
        border-color: #ec2109;
        box-shadow: 0px 0px 5px #ec20096b;
      }
    }
  }
  .bg-icon1 {
    rotate: 15deg;
    align-self: flex-end;
    width: 10rem;
  }
  .bg-icon2 {
    position: absolute;
    rotate: -20deg;
    top: 0;
    right: 0;
    width: 10rem;
  }
`;
const MarketIcons = styled.div`
  display: flex;
  gap: 10px;
  div {
    display: flex;
    gap: 4px;
    align-items: center;
    font-family: Arial, sans-serif;
  }
  img {
    width: 1rem;
    height: 1rem;
    object-fit: cover;
  }
`;

const size = "100%";
console.log(title);
return (
  <>
    {selectedNft && (
      <Grid>
        <div className="nft-preview">
          <div>{selectedNft.name}</div>
          <img
            src={
              "https://image-cache-service-z3w7d7dnea-ew.a.run.app/media?url=" +
              selectedNft.media
            }
            alt={selectedNft.title}
          />
        </div>
        <Form>
          <div className="label">List to</div>
          <MarketIcons>
            {Object.keys(marketIcons).map((market) => (
              <div key={market}>
                <img src={ipfsUrl(marketIcons[market])} alt={market} /> {market}
              </div>
            ))}
          </MarketIcons>
          <div className="label">Price</div>
          <div className="price">
            <input
              type="number"
              value={price}
              min="0"
              onChange={(e) => updateState({ price: e.target.value })}
            />
            NEAR
          </div>
          <div onClick={handleList} className="btn-main">
            List
          </div>
          <img className="bg-icon2" src={ipfsUrl(bgIocns[1])} alt="" />
        </Form>
      </Grid>
    )}
    <NFTs>
      {nfts?.map((nft) => (
        <div
          key={nft.tokenId}
          className={`${
            selectedNft?.tokenId === nft.tokenId ? "selected" : ""
          }`}
          onClick={() => updateState({ selectedNft: nft })}
        >
          <img
            src={
              "https://image-cache-service-z3w7d7dnea-ew.a.run.app/media?url=" +
              nft.media
            }
            alt={nft.title}
          />
        </div>
      ))}
    </NFTs>
    {nfts?.length === 0 && <div className="no-nft">You own no NFT yet.</div>}
  </>
);
