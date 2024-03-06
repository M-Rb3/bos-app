const [state, setState] = useState({
  currentTab: "explore",
});

const { currentTab } = state;

const updateState = (update) => {
  setState({ ...state, ...update });
};

const font = fetch("https://fonts.cdnfonts.com/css/seven-monkey-fury-bb").body;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: "Seven Monkey Fury BB", sans-serif;
  ${font}
  .no-nft {
    font-size: 34px;
    text-align: center;
  }
  .btn-main {
    font-size: 1rem;
    margin-top: 1rem;
    background-color: #fff;
    width: fit-content;
    background-image: none;
    background-position: 0 90%;
    background-repeat: repeat no-repeat;
    background-size: 4px 3px;
    border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
    border-style: solid;
    border-width: 2px;
    border-color: #ec2109;
    box-shadow: #890e3334 15px 28px 25px -18px;
    box-sizing: border-box;
    color: #ec2109;
    cursor: pointer;
    display: inline-block;
    outline: none;
    padding: 1em;
    text-decoration: none;
    transition: all 235ms ease-in-out;
    border-bottom-left-radius: 15px 255px;
    border-bottom-right-radius: 225px 15px;
    border-top-left-radius: 255px 15px;
    border-top-right-radius: 15px 225px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    &.active {
      background: #ec2109;
      color: white;
    }
    @media only screen and (max-width: 480px) {
      font-size: 12px;
    }
  }
  .btn-main:hover {
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px -5px;
    transform: translate3d(0, 2px, 0);
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    gap: 1rem;
    margin-left: 1rem;
    margin-bottom: 2rem;
  }
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  h1 {
    color: #ec2109;
    font-size: 5rem;
  }
  .description {
    max-width: 800px;
    margin: 1rem auto;
    font-size: 20px;
  }
  @media only screen and (max-width: 480px) {
    h1 {
      font-size: 3rem;
    }
    .description {
      font-size: 14px;
      margin-bottom: 2rem;
    }
  }
`;
const bgIocns = [
  "bafkreicrkimq4qurz2otbav3qiffroysujryrny4min7lxqjlqpembzxay",
  "bafkreihutrcg7fvrcwq47yzg3kinnnl5bqzo7on7rrrb37xejojjx3vrya",
  "bafkreihlclbgvfhugq4y2gso2knpd6iiedyshc2lmn2eub3wwlmg77ah4e",
];

const customStyle = `
--primary-color:#ec2109;
--primary-light: #890e3334;
`;
const donorAddress = "donors.yearofchef.near";
const cooksAddress = "cooks.yearofchef.near";
const menuAddress = "menu.yearofchef.near";
const ogAddress = "og.yearofchef.near";
const cooksLeft = Near.view("mint.yearofchef.near", "nft_supply_for_owner", {
  account_id: cooksAddress,
});
const ogLeft = Near.view("mint.yearofchef.near", "nft_supply_for_owner", {
  account_id: ogAddress,
});
const menuLeft = Near.view("mint.yearofchef.near", "nft_supply_for_owner", {
  account_id: menuAddress,
});
const donorsLeft = Near.view("mint.yearofchef.near", "nft_supply_for_owner", {
  account_id: donorAddress,
});
const leftItems = [
  { address: donorAddress, left: donorsLeft, total: "1230" },
  { address: menuAddress, left: menuLeft, total: "400" },
  { address: ogAddress, left: ogLeft, total: "180" },
  { address: cooksAddress, left: cooksLeft, total: "204" },
];
const OwnersCount = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
  .item {
    display: flex;
    gap: 1rem;
    .number span {
      color: #ec2109;
    }
  }
`;

const tabs = [
  { label: "list", src: "bos.yearofchef.near/widget/list" },
  { label: "explore", src: "baam25.near/widget/store" },
  { label: "activity", src: "baam25.near/widget/storeActivities" },
  {
    label: "royalty payouts",
    src: "bos.yearofchef.near/widget/Donations",
  },
];

return (
  <Container>
    <Header>
      <h1> year of the chef</h1>
      <div className="description">
        The free mint of 2024 hand-drawn dragon-chef NFTs for public goods
        supporters on 🫕 Potlock where royalties are auto-redistributed to
        approved public goods on the registry.
      </div>
      <OwnersCount>
        {leftItems.map((item) => (
          <div key={item.address} className="item">
            <div className="address">{item.address}</div>
            <div className="number">
              <span> {item.left}</span> / {item.total}
            </div>
          </div>
        ))}
      </OwnersCount>
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            onClick={() => updateState({ currentTab: tab.label })}
            className={`btn-main ${tab.label === currentTab ? "active" : ""}`}
          >
            {tab.label}
          </div>
        ))}
        <a
          href="https://www.yearofchef.org/mint"
          target="_blank"
          className={`btn-main`}
        >
          mint
        </a>
      </div>
    </Header>
    <Widget
      src={tabs.find((option) => option.label == currentTab).src}
      props={{
        store: "mint.yearofchef.near",
        showHeader: false,
        customStyle,
        contractId: "mint.yearofchef.near",
        color: "#ec2109",
      }}
    />
  </Container>
);
