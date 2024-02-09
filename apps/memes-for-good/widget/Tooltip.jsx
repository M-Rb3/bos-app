const text = props.text || "";
const textOnHover = props.textOnHover || "";

const ipfsToImg = (cid) => "https://ipfs.near.social/ipfs/" + cid;

const [isHoverd, setIsHovered] = useState(false);

const Hover = styled.div`
  :first-child {
    width: 30rem;
  }
  div {
    background: white;
    height: 5rem;
    white-space: nowrap;
    padding: 0 1rem;
    color: black;
    font-size: 2rem;
    font-family: "Comic Neue", cursive;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    &.active {
      font-family: "Architects Daughter", cursive;
      font-size: 1rem;
      border-image: linear-gradient(
          180deg,
          #7dcaab 0%,
          #b8d45c 12.5%,
          #fbc800 29.5%,
          #ffb14c 43.5%,
          #ff8cb5 62%,
          #c687ee 78.5%,
          #5c96fc 99%
        )
        30;
      border-width: 8px;
      border-style: solid;
      ul {
        margin-bottom: 0;
        cursor: default;
      }
    }
    p {
      border-bottom: 3px solid black;
      line-height: 1;
      margin: 0;
    }
    img {
      height: 1em;
    }
  }
`;
console.log(isHoverd);
return (
  <Hover
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {isHoverd ? (
      <div className="active">{textOnHover}</div>
    ) : (
      <div>
        <p> {text}</p>
        <img
          src={ipfsToImg(
            "bafkreihfbtzsdpgjy76ksqjwixky35yadhpweh4e2c4gzp235hiov6rut4"
          )}
          alt="info-icon"
        />
      </div>
    )}
  </Hover>
);
