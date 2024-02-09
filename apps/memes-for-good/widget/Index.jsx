const ipfsToImg = (cid) => "https://ipfs.near.social/ipfs/" + cid;
const font = fetch("https://fonts.cdnfonts.com/css/impact").body;
const font2 = fetch(
  "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap"
).body;
const font3 = fetch(
  "https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
).body;

const [navActive, setNavActive] = useState("Home");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${font}
  ${font2}
  ${font3}
 
  .memes-navbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
    position: sticky;
    gap: 2rem;
    align-items: center;
    div {
      font-family: "Impact", sans-serif;
      font-size: 40px;
      font-weight: 400;
      line-height: 36px;
      letter-spacing: 0;
      width: fit-content;
      border-bottom: 3px solid transparent;
      transition: all 300ms ease-in-out;
      text-align: center;
      cursor: pointer;
      padding-bottom: 2px;
      :hover {
        border-bottom-color: #000;
      }
      &.active {
        border-bottom-color: #000;
      }
    }
  }
  .subtitle {
    font-family: "Impact", sans-serif;
    align-items: center;
    -webkit-text-stroke: 2px #000;
    color: white;
    font-size: 3rem;
    letter-spacing: -0.03em;
  }
  .description {
    max-width: 800px;
    font-family: "Architects Daughter", cursive;
    font-size: 40px;
    font-weight: 400;
    line-height: 36px;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 5rem;
  }
  .line {
    height: 1px;
    width: 100%;
    background: #000;
  }
`;
const Hero = styled.div`
  background: linear-gradient(
    180deg,
    #7dcaab 0%,
    #b8d45c 12.5%,
    #fbc800 29.5%,
    #ffb14c 43.5%,
    #ff8cb5 62%,
    #c687ee 78.5%,
    #5c96fc 99%
  );
  display: flex;
  padding-top: 1rem;
  width: 100%;

  .hero-left {
    width: 70%;
    padding: 0 2rem;
    .title {
      width: 100%;
      display: flex;
      font-family: "Impact", sans-serif;
      align-items: baseline;
      -webkit-text-stroke: 4px #000;
      color: white;
      font-size: 5rem;
      font-weight: 400;
      letter-spacing: -0.03em;
      img {
        width: 1em;
        margin-right: 2rem;
      }
    }
    .hero-description {
      font-family: "Comic Neue", cursive;
      color: white;
      font-size: 48px;
      font-weight: 700;
      line-height: 3rem;
      letter-spacing: -0.03em;
      text-align: left;
      margin-bottom: 6rem;
      span {
        font-style: italic;
        font-weight: 500;
      }
    }
    .hero-links {
      display: flex;
      gap: 2rem;
      padding-bottom: 1rem;
    }
  }
  .hero-img {
    width: 30%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    img {
      width: 90%;
    }
  }
`;
const footerBg = ipfsToImg(
  "bafkreic5u47dy2o3vtg5tk3zbp3ewgrjg67nenlmgch2aoh2vavu2pcrz4"
);
const Main = styled.div`
  padding: 3rem 0;
  width: 100%;
  background-image: url(${footerBg});
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  .links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0 0.5rem;
  }
  .copyright {
    font-family: "Architects Daughter", cursive;
    font-size: 2rem;
    font-weight: 400;
    line-height: 36px;
    letter-spacing: 0em;
    text-align: center;
    margin-bottom: 2rem;
    a {
      color: black;
      text-decoration: underline;
    }
  }
`;

const nav = ["Home", "Donate", "Create Giveaway", "Join", "Feed", "Partner"];

const footerLinks = [
  {
    icon: "bafkreihrmb552uwtgwsh7z43mqvffxjqkj27yv3lapugltneurks4dtgcq",
    url: "/",
  },
  {
    icon: "bafkreiccgejbzxntsnwdxwldxk42qmzccar2jn7lq3kcf6mo7umiulcyou",
    url: "/",
  },
  {
    icon: "bafkreigclspyg25v6lzm3mspga2zbojkg2llmd3jng2v2php4lamfrww2y",
    url: "/",
  },
];

return (
  <Container>
    <div className="memes-navbar container">
      {nav.map((item) => (
        <div
          key={item}
          className={`${navActive === item ? "active" : ""}`}
          onClick={() => setNavActive(item)}
        >
          {item}
        </div>
      ))}
    </div>
    <div className="container">
      <Hero>
        <div className="hero-left">
          <h1 className="title">
            <img
              src={ipfsToImg(
                "bafkreicmc65s432bfqjtmkupsdk2qhzuwj3or6uhflss2lra6meuyl5gkq"
              )}
              alt="title"
            />
            MEMES FOR GOOD
          </h1>
          <div className="hero-description">
            A community initiative to leverage memes, tokens, NFT collections
            to 
            <span> incentivize donations</span> to public goods. 
          </div>
          <div className="subtitle">How to Get Involved </div>
          <div className="hero-links">
            <Widget
              src="bos.memesforgood.near/widget/Tooltip"
              props={{
                text: "Meme Token + NFT Creators",
                textOnHover: (
                  <ul>
                    <li>Allocate Supply to Pantry</li>
                    <li>Giveaways for Projects & Donors</li>
                  </ul>
                ),
              }}
            />
            <Widget
              src="bos.memesforgood.near/widget/Tooltip"
              props={{
                text: "Anyone",
                textOnHover: (
                  <ul>
                    <li>Charity Auction for Your Memes</li>
                    <li>Create A Giveaway</li>
                  </ul>
                ),
              }}
            />
          </div>
        </div>
        <div className="hero-img">
          <img
            src={ipfsToImg(
              "bafkreihhj4qmm7undp36hsli24cldedw3qt6zjkulgyy72qltrhw3g2dpe"
            )}
            alt="hero-img"
          />
        </div>
      </Hero>
    </div>
    <Main>
      <div className="subtitle">Our Case Studies </div>
      <Widget src="bos.memesforgood.near/widget/CaseStudies" />
    </Main>
    <div className="line container" />
    <Footer>
      <div className="links">
        {footerLinks.map((link) => (
          <a href={link.url} key={link.icon}>
            <img src={ipfsToImg(link.icon)} alt={link.icon} />
          </a>
        ))}{" "}
      </div>
      <div className="copyright">
        ⚡️ powered by <a href="https://everything.dev/"> everything.dev</a>
      </div>
    </Footer>
  </Container>
);
