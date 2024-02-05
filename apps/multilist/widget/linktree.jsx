const { theme } = props;
const [page, setPage] = useState(0);
const loggedIn = context.accountId ? props.loggedIn ?? false : false;
const accountId = loggedIn
  ? context.accountId ?? "baam25.near"
  : props.accountId ?? "baam25.near";
const viewingOwnAccount = accountId === context.accountId;

const AVAILABLE_THEMES = {
  default: "Default",
  dark: "Dark",
  gold: "Gold",
  blossom: "Blossom",
  vibrant: "Vibrant",
  aqua: "Aqua",
  neon: "Neon",
  vintage: "Vintage",
  eclectic: "Eclectic",
};
const themeName =
  theme in AVAILABLE_THEMES
    ? AVAILABLE_THEMES[theme]
    : AVAILABLE_THEMES["default"];

const Theme = VM.require(`mattb.near/widget/Linktree.Themes.${themeName}`);

const LinktreeSDK = VM.require("mattb.near/widget/Linktree.Utils.SDK");

// Load profile data
LinktreeSDK.load(accountId);

// Load NFTs
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
const Gallery = styled.div`
  max-width: 1000px;
  display: flex;
  margin: 3rem auto;
  align-items: center;
  .arrow-r {
    rotate: 180deg;
  }
  .arrow-r,
  .arrow-l {
    width: 2rem;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid black;
  }
  .slider-display {
    position: relative;
    width: 49rem;
    height: 15rem;
    overflow: hidden;
    @media only screen and (max-width: 927px) {
      width: 32rem;
    }
    @media only screen and (max-width: 627px) {
      width: 15rem;
    }
  }
  .slider-track {
    transition: all 300ms ease;
    position: absolute;
    display: flex;
    gap: 2rem;
    justify-content: center;
    .nft-card {
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
  }
`;
const size = "100%";

const HandleUpSlide = () => {
  if (page < nfts.length - 1) {
    setPage(page + 1);
  } else {
    setPage(0);
  }
};
const HandleDownSlide = () => {
  if (page > 0) {
    setPage(page - 1);
  } else {
    setPage(nfts.length - 1);
  }
};

console.log(window);
return (
  <>
    <Theme.Linktree>
      <a href={LinktreeSDK.getShareUrl(accountId)} target="_blank">
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: LinktreeSDK.account.data.image,
            alt: LinktreeSDK.account.data.name,
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
            style: {
              height: "100%",
              maxHeight: 150,
              borderRadius: "50%",
              aspectRatio: 1 / 1,
              objectFit: "cover",
            },
          }}
        />
      </a>
      <Theme.Details>
        <h2>{LinktreeSDK.account.data.name || accountId}</h2>

        <h5>@{accountId}</h5>
        {LinktreeSDK.account.tags.length > 0 && (
          <Theme.TagsSection>
            <Widget
              src="near/widget/Tags"
              props={{
                tags: LinktreeSDK.account.tags,
              }}
            />
          </Theme.TagsSection>
        )}
      </Theme.Details>
      {LinktreeSDK.account.data.linktree && (
        <Theme.LinktreeLinks>
          {LinktreeSDK.account.data.linktree.website && (
            <a
              href={`https://${LinktreeSDK.account.data.linktree.website}`}
              target="_blank"
            >
              <button style={{ width: "100%" }}>
                {" "}
                <i className="bi bi-globe"></i> Website
              </button>
            </a>
          )}

          {LinktreeSDK.account.data.linktree.github && (
            <>
              <a
                href={`https://github.com/${LinktreeSDK.account.data.linktree.github}`}
                target="_blank"
              >
                <button style={{ width: "100%" }}>
                  <i className="bi bi-github"></i> Github
                </button>
              </a>
            </>
          )}

          {LinktreeSDK.account.data.linktree.twitter && (
            <a
              href={`https://twitter.com/${LinktreeSDK.account.data.linktree.twitter}`}
              target="_blank"
            >
              <button style={{ width: "100%" }}>
                <i className="bi bi-twitter"></i> Twitter
              </button>
            </a>
          )}

          {LinktreeSDK.account.data.linktree.telegram && (
            <a
              href={`https://t.me/${LinktreeSDK.account.data.linktree.telegram}`}
              target="_blank"
            >
              <button style={{ width: "100%" }}>
                <i className="bi bi-telegram"></i> Telegram
              </button>
            </a>
          )}
        </Theme.LinktreeLinks>
      )}
      <Gallery>
        <img
          src="https://ipfs.near.social/ipfs/bafkreiayzzl6o7cgvrv6dvlwi4kahvjojbldljs24ktw7jmidwlpxjziym"
          className="arrow-l"
          onClick={HandleDownSlide}
          alt="angle left"
        />
        <div className="slider-display">
          <div
            className="slider-track"
            style={{
              transform: `translateX(-${17 * page}rem)`,
            }}
          >
            {nfts?.map((nft) => (
              <div key={nft.tokenId} className="nft-card">
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
          </div>
        </div>
        <img
          className="arrow-r"
          onClick={HandleUpSlide}
          src="https://ipfs.near.social/ipfs/bafkreiayzzl6o7cgvrv6dvlwi4kahvjojbldljs24ktw7jmidwlpxjziym"
          alt="angle left"
        />
      </Gallery>{" "}
    </Theme.Linktree>
  </>
);
