const accountId = props.accountId || context.accountId;
const store = props.store;
const customStyle = props.customStyle || "";
// Paginaton
const perPage = props.perPage || 50;
const AFFILIATE_ACCOUNT = props.affiliateAccount || "baam25.near";

if (!store) return "pass storeId";

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
        where: {nft_contract_id: {_eq: "${store}"}}
        order_by: {title: asc}
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
        where: {nft_contract_id: {_eq: "${store}"}}
      ) {
        aggregate {
          count(distinct: true)
        }
      }
      nft_earnings(where: {nft_contract_id: {_eq: "mint.yearofchef.near"}}) {
        amount
      }
      nft_activities(where: {nft_contract_id: {_eq: "mint.yearofchef.near"}}) {
        kind
        price
        action_receiver
        action_sender
        timestamp
        token_id
        receipt_id
      }
    }
  `,
  }),
});
const nfts = data?.body?.data?.mb_views_nft_tokens;
const nft_earnings = data?.body?.data?.nft_earnings;
const nft_activities = data?.body?.data?.nft_activities;
console.log(nft_activities);
const owners =
  data?.body?.data?.mb_views_nft_owned_tokens_aggregate?.aggregate.count;
const YoctoToNear = (amountYocto) => {
  return new Big(amountYocto || 0).div(new Big(10).pow(24)).toString();
};
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
    box-shadow: 0px 0px 20px var(--primary-light);
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
  .owner {
    color: var(--primary-color);
    font-size: 12px;
    font-weight: 500;
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

const Pagination = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  div {
    border: 1px solid transparent;
    background: var(--primary-color);
    border-radius: 2px;
    padding: 10px;
    font-size: 12px;
    color: white;
    cursor: pointer;
    :hover {
      background: var(--primary-light);
    }
    &.active {
      background: white;
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }
`;
const Stats = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
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

// list of pages
const paginations = [
  ...Array(
    parseInt(nfts?.length / perPage) + (nfts?.length % perPage > 0 ? 1 : 0)
  ).keys(),
];

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
const PaginationNumber = () => {
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
  <Container>
    <h1 className="store">{store}</h1>
    <Stats>
      <Total>
        <div> Items</div> <div>{nfts.length}</div>
      </Total>
      <Total>
        <div> Total Owners</div> <div>{owners}</div>
      </Total>
      <Total>
        <div> Volume</div> <div>{YoctoToNear(volume.toString())} NEAR</div>
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
                <div className="tilte">{nft.title}</div>
                <div className="owner">
                  {nft.owner.length > 20
                    ? nft.owner.slice(0, 7) + "...."
                    : nft.owner}
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
    {<PaginationNumber />}
  </Container>
) : (
  <p>loading...</p>
);
