const ipfsToImg = (cid) => "https://ipfs.near.social/ipfs/" + cid;

const Container = styled.div`
  .container {
    display: grid;
    grid-template-columns: repeat(3, minmax(0px, 1fr));
    gap: 2rem;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 1rem;
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
      .title {
        font-family: "Comic Neue", cursive;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .text {
        font-family: "Architects Daughter", cursive;
        font-size: 1.5rem;
        font-weight: 400;
        text-align: center;
        margin-top: 1rem;
        > div {
          color: #0047ff;
          font-family: "Comic Neue", cursive;
          font-weight: 600;
        }
      }
      img {
        width: 60%;
      }
    }
  }
`;

const cards = [
  {
    title: "$BEAN Token",
    img: "bafkreifbtfd32qjyazmz7tjozzhh2eh2qwlexdrbwqdpmhb6zi6n6pjf3q",
    text: (
      <div className="text">
        <div>Allocate 4 Billion</div> Tokens to donors on potlock
      </div>
    ),
  },
  {
    title: "$LONK",
    img: "bafkreidubpbluwdmlaoyiuabhsipcshd3bcfsqrnt5glw6cbpxl5vu7xny",
    text: (
      <div className="text">
        {" "}
        Community members allocate for Potlock Projects
      </div>
    ),
  },
  {
    title: "$NDC Giveaways for Donations",
    img: "bafkreide25dv2dzd27merqjbngj5tsqhtnmfsh4whgi3pjpxawn6tkctae",
    text: <div className="text">$NDC Token give away through giveaways</div>,
  },
];

return (
  <Container>
    <div className="container">
      {cards.map((card) => (
        <div key={card.title}>
          <div className="title">{card.title}</div>
          <img src={ipfsToImg(card.img)} alt={card.title} />
          {card.text}
        </div>
      ))}
    </div>
  </Container>
);
