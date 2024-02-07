const contractId = props.contractId || "mint.yearofchef.near";
const cursomStyle = props.cursomStyle || "";
const perPage = props.contractId || 100;

const nearLogo =
  "https://ipfs.near.social/ipfs/bafkreib2cfbayerbbnoya6z4qcywnizqrbkzt5lbqe32whm2lubw3sywr4";
const [page, setPage] = useState(0);

const _address = (address) => {
  if (address.length > 20) return address.slice(0, 20) + "...";
  else return address;
};
const YoctoToNear = (amountYocto) => {
  return new Big(amountYocto || 0).div(new Big(10).pow(24)).toString();
};
const utcDate2 = new Date(Date.UTC(0, 0, 0, 0, 0, 0));

const currentTimestamp = new Date().getTime();
console.log("currentTimestamp", currentTimestamp);

const getTimePassed = (timestamp) => {
  // Get the current timestamp in milliseconds

  console.log(currentTimestamp);
  // Calculate the difference in milliseconds
  const timePassed = currentTimestamp - timestamp;

  // Convert milliseconds to seconds, minutes, hours, etc.
  const secondsPassed = Math.floor(timePassed / 1000);
  const minutesPassed = Math.floor(secondsPassed / 60);
  const hoursPassed = Math.floor(minutesPassed / 60);
  const daysPassed = Math.floor(hoursPassed / 24);

  let time = 0;

  // Display the time passed conditionally
  if (daysPassed > 0) {
    time = `${daysPassed} days`;
  } else if (hoursPassed > 0) {
    time = `${hoursPassed} hours`;
  } else if (minutesPassed > 0) {
    time = `${minutesPassed} minutes`;
  } else {
    time = `${secondsPassed} seconds`;
  }
  return time;
};

const data = fetch("https://graph.mintbase.xyz", {
  method: "POST",
  headers: {
    "mb-api-key": "anon",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query MyQuery {
        nft_activities(
            where: {nft_contract_id: {_eq: "${contractId}"}}
            order_by: {timestamp: desc}
          ) {
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
const nft_activities = data?.body?.data?.nft_activities;
if (!nft_activities) return "Loading ...";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  .header {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    gap: 1rem;
    background: black;
    color: white;
    margin-bottom: 1rem;
    > div {
      text-align: center;
    }
    ${cursomStyle}
  }
  .trx-row {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    width: 100%;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #0000005a;
    &:last-of-type {
      border-bottom-color: transparent;
    }
    > div {
      text-align: center;
      margin: auto;
    }
    .kind {
      width: fit-content;
      height: fit-content;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.9;
      padding: 4px;
      border-radius: 2px;
      text-transform: uppercase;
    }
    .price {
      display: flex;
      gap: 4px;
      align-items: center;
      font-weight: 600;
      img {
        width: 14px;
      }
    }
  }
`;
const Trx = styled.div``;
const kindColor = {
  list: "#8c4fe5",
  unlist: "#8c4fe5",
  sale: "#0a7d6c",
  transfer: "#4f58a3",
  make_offer: "#4f58a3",
  mint: "#000000",
};

console.log(nft_activities.slice(page * perPage, (page + 1) * perPage));

return (
  <Container>
    <div className="header">
      <div>Event</div>
      <div>Token Id</div>
      <div>From</div>
      <div>To</div>
      <div> Price</div>
      <div>date</div>
    </div>
    <div>
      {nft_activities
        .slice(page * perPage, (page + 1) * perPage)
        .map((activity) => (
          <div className="trx-row" key={activity.receipt_id}>
            <div
              style={{
                background: kindColor[activity.kind] + "40",
                color: kindColor[activity.kind],
              }}
              className="kind"
            >
              {activity.kind}
            </div>
            <div> {activity.token_id} </div>
            <div> {_address(activity.action_sender)} </div>
            <div> {_address(activity.action_receiver)} </div>
            <div>
              {" "}
              {activity.price ? (
                <div className="price">
                  {YoctoToNear(activity.price)}
                  <img src={nearLogo} alt="NEAR" />
                </div>
              ) : (
                "-"
              )}{" "}
            </div>
            <div>
              {" "}
              {getTimePassed(new Date(activity.timestamp).getTime())} ago{" "}
            </div>
          </div>
        ))}
    </div>
    <Widget
      src="baam25.near/widget/pagination"
      props={{
        onClick: (page) => {
          console.log(page);
          console.log(setPage);
          setPage(page);
        },
        data: nft_activities,
        page: page,
        perPage: perPage,
      }}
    />
  </Container>
);
