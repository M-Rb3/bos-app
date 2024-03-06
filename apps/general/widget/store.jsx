const accountId = props.accountId || context.accountId;
const store = props.store;
const customStyle = props.customStyle || "";
const description = props.description || "";
const showHeader = props.showHeader === null ? true : props.showHeader;
const header = props.header;
// Paginaton
const perPage = props.perPage || 48;
const AFFILIATE_ACCOUNT = props.affiliateAccount || "baam25.near";

const nearLogo =
  "https://ipfs.near.social/ipfs/bafkreib2cfbayerbbnoya6z4qcywnizqrbkzt5lbqe32whm2lubw3sywr4";

if (!store) return "pass storeId";

const [page, setPage] = useState(0);
const [filter, setFilter] = useState("Filter");

const YoctoToNear = (amountYocto) => {
  return new Big(amountYocto || 0).div(new Big(10).pow(24)).toString();
};
const _price = (nft) => {
  if (nft) {
    return nft.listings[0]?.price;
  }
};
const _address = (address, _limit) => {
  const limit = _limit || 20;
  if (address.length > limit) return address.slice(0, 10) + "...";
  else return address;
};

const data = fetch("https://graph.mintbase.xyz", {
  method: "POST",
  headers: {
    "mb-api-key": "anon",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query MyQuery {
      mb_views_nft_tokens(
        where: {nft_contract_id: {_eq: "${store}"}}
        order_by: {title: asc}
      ) {
        token_id
        title
        owner
        media
        metadata_id
        listings(where: {unlisted_at: {_is_null: true}, accepted_at: {_is_null: true}}) {
          price
        }
      }
      mb_views_nft_owned_tokens_aggregate(
        distinct_on: owner
        where: {nft_contract_id: {_eq: "${store}"}}
      ) {
        aggregate {
          count(distinct: true)
        }
      }
      nft_earnings(where: {nft_contract_id: {_eq: "${store}"}}) {
        amount
      }
    }
  `,
  }),
});
let nfts = data?.body?.data?.mb_views_nft_tokens;
if (!nfts) return "Loading";
const nft_earnings = data?.body?.data?.nft_earnings;
const owners =
  data?.body?.data?.mb_views_nft_owned_tokens_aggregate?.aggregate.count;

let floorPrice = 0;
if (nfts.length) {
  const lowestPrice = nfts.reduce((minObj, obj) => {
    const currentPrice = _price(obj);
    const minObjPrice = _price(minObj);
    // Exclude null and undefined values
    if (currentPrice != null && currentPrice !== undefined) {
      // If minObj is null or currentPrice is lower than minObj.price, update minObj
      if (minObj === null || currentPrice < minObjPrice) {
        return obj;
      }
    }
    // Otherwise, keep minObj unchanged
    return minObj;
  }, null);
  floorPrice = YoctoToNear(_price(lowestPrice).toString());
}

const sortByName = () => {
  nfts.sort((a, b) => {
    const nameA = a.title; // Ignore case during comparison
    const nameB = b.title;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
};

// Filter
switch (filter) {
  case "Name":
    sortByName();
    break;
  case "Price: Low To High":
    nfts.sort((a, b) => {
      const aPrice = a.listings[0].price;
      const bPrice = b.listings[0].price;
      if (aPrice === undefined && bPrice === undefined) {
        return 0; // no change in order for null values
      }
      if (aPrice === undefined) {
        return 1; // move object with null price to the end
      }
      if (bPrice === undefined) {
        return -1; // move object with null price to the end
      }
      return aPrice - bPrice; // compare numeric values for non-null prices
    });
    break;
  case "Price: High To Low":
    nfts.sort((a, b) => {
      const aPrice = a.listings[0].price || 0;
      const bPrice = b.listings[0].price || 0;
      return bPrice - aPrice;
    });
    break;
  case "Owned by me":
    nfts = nfts.filter((nft) => nft.owner === accountId);
    break;
  default:
    sortByName();
    break;
}
// GET Volume
let volume = new Big(0);
if (nft_earnings?.length) {
  nft_earnings.forEach((nft) => {
    volume = volume.plus(new Big(nft.amount));
  });
}
let buy = (price, token_id) => {
  const gas = 200000000000000;
  const deposit = new Big(price).toFixed(0);
  Near.call(
    marketId,
    "buy",
    {
      nft_contract_id: store,
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

const Container = styled.div`
  --primary-color: #aeaeae;
  --primary-light: #aeaeae75;
  display: flex;
  flex-direction: column;
  .store {
    padding-left: 1rem;
  }
  .card-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-between;
    @media only screen and (max-width: 480px) {
      justify-content: center;
    }
  }
  ${customStyle}
`;
const NFTcard = styled.a`
  display: flex;
  width: 250px;
  flex-direction: column;
  border: 2px solid var(--primary-color);
  border-radius: 10px;
  box-shadow: 0px 0px 5px var(--primary-light);
  transition: all 300ms ease-in-out;
  cursor: pointer;
  overflow: hidden;
  text-decoration: none;
  height: 100%;
  :hover {
    box-shadow: 0px 0px 30px var(--primary-light);
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
      background-image: url("https://i.stack.imgur.com/ATB3o.gif");
    }
  }
  .desc {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 1rem;
  }
  .tilte {
    color: black;
  }

  .listed {
    font-size: 10px;
    color: #6c757d;
    margin-left: auto;
  }
  .price {
    font-size: 12px;
    color: var(--primary-color);
    margin-left: auto;
    font-weight: bold;
  }
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  .filter {
    margin-left: auto;
    position: relative;
    @media only screen and (max-width: 480px) {
      width: 100%;
    }
  }
`;
const Total = styled.div`
  font-size: 16px;
  flex-direction: column;
  text-align: center;
  padding: 10px;
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  div:last-child {
    color: var(--primary-color);
    font-weight: 600;
  }
`;
const Button = styled.button`
  border-radius: 6px;
  background: transparent;
  width: 100%;
  padding: 6px;
  color: var(--primary-color);
  border-color: var(--primary-color);
  transition: all 300ms ease-in-out;
  :hover {
    background: var(--primary-color);
    color: white;
  }
`;
const Trigger = styled.div`
  border: 2px solid var(--primary-color);
  border-radius: 1rem;
  padding: 10px 1rem;
  img {
    width: 12px;
  }
`;
const Owner = styled.a`
  color: var(--primary-color) !important;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
`;
const Price = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  font-weight: 600;
  justify-content: center;
  img {
    width: 14px;
  }
`;
const stats = {
  Items: nfts.length,
  "Total Owners": owners,
  "Floor Price": (
    <Price>
      {floorPrice} <img src={nearLogo} alt="near-logo" />
    </Price>
  ),
  Volume: (
    <Price>
      {YoctoToNear(volume.toString())} <img src={nearLogo} alt="near-logo" />
    </Price>
  ),
};
const filterItems = [
  {
    name: "Name",
    onSelect: () => setFilter("Name"),
  },
  {
    name: "Price: Low To High",
    onSelect: () => setFilter("Price: Low To High"),
  },
  {
    name: "Price: High To Low",
    onSelect: () => setFilter("Price: High To Low"),
  },
  {
    name: "Owned by me",
    onSelect: () => setFilter("Owned by me"),
  },
];

const ProfileOverlay = ({ owner }) => (
  <Widget
    src="near/widget/AccountProfileOverlay"
    props={{
      accountId: owner,
      children: (
        <Owner
          href={"https://near.org/near/widget/ProfilePage?accountId=" + owner}
          className="address"
          target="_blank"
        >
          {_address(owner)}{" "}
        </Owner>
      ),
    }}
  />
);

return (
  <Container>
    {showHeader && (header ?? <h1 className="store">{store}</h1>)}
    {description && description}
    <Stats>
      {Object.keys(stats).map((label) => (
        <Total key={label}>
          <div> {label}</div> <div>{stats[label]}</div>
        </Total>
      ))}
      <div className="filter">
        <Widget
          src="near/widget/DIG.DropdownMenu"
          props={{
            items: filterItems,
            trigger: (
              <Trigger>
                {filter}
                <img
                  src="https://ipfs.near.social/ipfs/bafkreib55nddf64vsdxlhms5xpe6uirgizr2jbxbjecafcp3ehwqmaswd4"
                  alt="arrow"
                />
              </Trigger>
            ),
          }}
        />
      </div>
    </Stats>
    <div className="card-wrapper">
      {nfts.length === 0 && (
        <p
          style={{
            margin: "auto",
            paddingTop: "1rem",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          No Owned NFTs
        </p>
      )}
      {nfts.slice(page * perPage, (page + 1) * perPage).map((nft) => {
        let priceYocto = _price(nft);
        if (priceYocto) {
          priceYocto = priceYocto
            .toLocaleString()
            .replace(/,/g, "")
            .replace(/\s/g, "");
        }
        const priceNear = YoctoToNear(priceYocto);
        return (
          <div className="d-flex flex-column between wrap gap-1 w-15 p-3">
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
                <div className="tilte">{nft.title}</div>
                <div className="owner">
                  <ProfileOverlay owner={nft.owner} />
                </div>
                {!priceYocto && <div className="listed">not listed</div>}
                {priceYocto && (
                  <Button
                    disabled={!accountId}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!accountId) return;
                      buy(priceYocto, nft.token_id);
                    }}
                  >
                    Buy {priceNear} N
                  </Button>
                )}
              </div>
            </NFTcard>
          </div>
        );
      })}
    </div>
    <Widget
      src="baam25.near/widget/pagination"
      props={{
        onClick: (page) => setPage(page),
        data: nfts,
        page: page,
        perPage: perPage,
        bgColor: "var(--primary-color)",
      }}
    />
  </Container>
);
