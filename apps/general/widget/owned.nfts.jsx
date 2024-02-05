const accountId = props.accountId || context.accountId;
console.log(accountId);

const [page, setPage] = useState(0);

const data = fetch("https://graph.mintbase.xyz", {
  method: "POST",
  headers: {
    "mb-api-key": "omni-site",
    "Content-Type": "application/json",
    "x-hasura-role": "anonymous",
  },
  body: JSON.stringify({
    query: `
  query v2_omnisite_GetOwnedTokens{
    tokens: mb_views_nft_owned_tokens(
      where: {
        owner: { _eq: "${accountId}" }
      }
    ) {
      tokenId: token_id
      contractId: nft_contract_id
      media
    }}
`,
  }),
});

const nfts = data.body?.data?.tokens;

const Wrapper = styled.div`
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: 3rem auto;
  align-items: center;
`;
const Contaienr = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  > div {
    width: 15rem;
    height: 15rem;
    border-radius: 10px;
    overflow: hidden;
    img {
      transition: all 300ms ease-in-out;
    }
    :hover img {
      scale: 1.1;
    }
  }
`;
const Pagination = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  div {
    border: 1px solid transparent;
    background: #8c8c8c;
    border-radius: 2px;
    padding: 10px;
    font-size: 12px;
    color: white;
    cursor: pointer;
    :hover {
      background: #8c8c8c;
    }
    &.active {
      background: white;
      color: #8c8c8c;
      border-color: #8c8c8c;
    }
  }
`;

const size = "100%";

// Paginaton
const perPage = 9;
// list of pages
const paginations = [...Array(parseInt(nfts?.length / perPage) + 1).keys()];
+(nfts?.length % perPage > 0 ? 1 : 0);

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
const PagNumber = () => {
  if (paginations.length < 4) {
    return (
      <Pagination>
        {paginations?.map((num) => (
          <Page>{num}</Page>
        ))}
      </Pagination>
    );
  } else if (page === 0) {
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

return (
  <Wrapper>
    <Contaienr>
      {nfts?.slice(page * perPage, (page + 1) * perPage)?.map((nft) => (
        <div key={nft.tokenId}>
          <Widget
            src="mob.near/widget/NftImage"
            props={{
              nft: { tokenId: nft.tokenId, contractId: nft.contractId },
              style: {
                width: size,
                height: size,
                objectFit: "cover",
                minWidth: size,
                minHeight: size,
                maxWidth: size,
                maxHeight: size,
                overflowWrap: "break-word",
                borderRadius: "inherit",
              },
              className: "",
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreihdiy3ec4epkkx7wc4wevssruen6b7f3oep5ylicnpnyyqzayvcry",
              alt: `NFT ${nft.contractId} ${nft.tokenId}`,
            }}
          />
        </div>
      ))}
    </Contaienr>
    <PagNumber />
  </Wrapper>
);
