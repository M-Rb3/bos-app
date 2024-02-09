const nearToUsd = props.nearToUsd || 1;

const [totalDonations, setDonations] = useState([]);
const [index, setIndex] = useState(0);
const [page, setPage] = useState(0);

const perPage = 50; // need to be less than 50

const limit = 100;

// Get all Donations
const donationsPart = Near.view("donate.potlock.near", "get_donations", {
  from_index: limit * index,
  limit: limit,
});

if (donationsPart === null) return "loading";

if (
  donationsPart.length === 100 &&
  totalDonations[totalDonations.length - 1].id !==
    donationsPart[donationsPart.length - 1].id
) {
  setIndex(index + 1);
  setDonations([...totalDonations, ...donationsPart]);
  return "loading";
}
const donations = [...totalDonations];

if (donationsPart.length < 100) {
  donations.push(...donationsPart);
}

const calcDonations = (donation) => {
  const lastDonationAmount = Big(
    donation.total_amount -
      (donation.referrer_fee || 0) -
      (donation.protocol_fee || 0)
  ).div(Big(1e24));
  return parseFloat(lastDonationAmount);
};

const uniqueDonations = donations.reduce((accumulator, currentDonation) => {
  const existingDonation = accumulator.find(
    (item) => item.donor_id === currentDonation.donor_id
  );

  if (existingDonation) {
    // Update the total amount if the donor_id already exists
    existingDonation.amount += calcDonations(currentDonation);
  } else {
    // Add a new entry if the donor_id doesn't exist
    accumulator.push({
      donor_id: currentDonation.donor_id,
      amount: calcDonations(currentDonation),
    });
  }

  return accumulator;
}, []);
// Sorted Unique Donors according to amount
const sortedDonations = uniqueDonations.sort((a, b) => b.amount - a.amount);

const _address = (address, max, limit) => {
  if (address.length > max || 20) return address.slice(0, limit || 10) + "...";
  else return address;
};

function reverseArr(input) {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

const nearLogo =
  "https://ipfs.near.social/ipfs/bafkreib2cfbayerbbnoya6z4qcywnizqrbkzt5lbqe32whm2lubw3sywr4";

// Get the current date in the local time zone
const currentDate = new Date();

// Calculate the time zone offset in milliseconds
let localTimeZoneOffsetMinutes = currentDate.getTimezoneOffset();
localTimeZoneOffsetMinutes = localTimeZoneOffsetMinutes * 60 * 1000;

const currentTimestamp = new Date().getTime();
const getTimePassed = (timestamp) => {
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

const Container = styled.div`
  --primary-color: #9f1239;
  .donations {
    display: flex;
    flex-direction: column;
    .header {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      gap: 1rem;
      background: var(--primary-color);
      color: white;
      margin-bottom: 1rem;
      div {
        text-align: center;
      }
    }
    .donation-row {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      width: 100%;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #0000003e;
      &:last-of-type {
        border-bottom-color: transparent;
      }
      div,
      span {
        text-align: center;
        margin: auto;
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
      .address {
        color: var(--primary-color);
        font-weight: 500;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 2px;
        transition: all 200ms;
        :hover {
          background: var(--primary-color);
          color: white;
        }
      }
    }
  }
  .leaderboard {
    width: 100%;
    .cards {
      display: flex;
      gap: 3rem;
      margin-top: 2rem;
      margin-bottom: 5rem;
      > div {
        width: 30%;
        display: flex;
      }
      .top {
        width: 40%;
        scale: 1.1;
      }
      @media only screen and (max-width: 670px) {
        flex-direction: column;
        justify-content: center;
        > div {
          width: 100%;
          display: flex;
        }
        .top {
          scale: 1;
          width: 100%;
        }
      }
    }
  }
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 2px 4px #00000081;
  width: 100%;
  position: relative;
  padding-bottom: 1rem;
  font-size: 14px;
  .name {
    font-weight: bold;
    color: var(--primary-color);
  }
  .description {
    color: #b3b3b3;
  }
  .tag {
    position: absolute;
    right: 4px;
    top: 4px;
    background: white;
    border-radius: 2px;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 18px;
      height: auto;
    }
  }
  .background {
    height: 100px;
    width: 100%;
  }
  .profile {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    transform: translateY(-50%);
    position: relative;
    :before {
      content: " ";
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      background-image: url("https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi");
    }
  }
  .amount {
    margin-top: 1rem;
    border: 1px solid #b3b3b3;
    padding: 4px;
    border-radius: 4px;
  }
`;

const rank1 = Social.getr(`${sortedDonations[0].donor_id}/profile`);
const rank2 = Social.getr(`${sortedDonations[1].donor_id}/profile`);
const rank3 = Social.getr(`${sortedDonations[2].donor_id}/profile`);
console.log(sortedDonations[0].donor_id);
if (rank1 === null || rank2 === null || rank3 === null) return;
const leaderboard = [
  {
    rank: "#2",
    name: rank2.name || sortedDonations[1].donor_id,
    description: rank2.description || "-",
    image: rank2.image,
    backgroundImage: rank2.backgroundImage,
    amount: sortedDonations[1].amount,
  },
  {
    rank: (
      <img
        src="https://ipfs.near.social/ipfs/bafkreigpq56kv3p4kjtneiclx6sne3qrxtg5jho34yq2j6nnxli3p7aboe"
        alt="top"
      />
    ),
    name: rank2.name || sortedDonations[0].donor_id,
    className: "top",
    description: rank1.description || "-",
    image: rank1.image,
    backgroundImage: rank1.backgroundImage,
    amount: sortedDonations[0].amount,
  },
  {
    rank: "#3",
    name: rank2.name || sortedDonations[2].donor_id,
    description: rank3.description || "-",
    image: rank3.image,
    backgroundImage: rank3.backgroundImage,
    amount: sortedDonations[2].amount,
  },
];

console.log(leaderboard);

return (
  <Container>
    <div className="donations">
      <div className="leaderboard">
        <h1>Donors Leaderboard</h1>
        <div className="cards">
          {leaderboard.map((donation) => (
            <div key={donation} className={donation.className || ""}>
              <Card>
                <Widget
                  src="mob.near/widget/Image"
                  props={{
                    image: donation.backgroundImage,
                    className: "background",
                    alt: donation.name,
                    fallbackUrl:
                      "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
                  }}
                />
                <div className="tag">{donation.rank}</div>
                <Widget
                  src="mob.near/widget/Image"
                  props={{
                    image: donation.image,
                    className: "profile",
                    alt: donation.name,
                    fallbackUrl:
                      "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
                  }}
                />{" "}
                <a
                  href={
                    "https://near.org/near/widget/ProfilePage?accountId=" +
                    recipient_id
                  }
                  className="name"
                  target="_blank"
                >
                  {_address(donation.name)}
                </a>
                <div className="description">
                  {_address(donation.description, 30, 20)}
                </div>
                <div className="amount">{donation.amount} Donated</div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="header">
        <div>ID</div>
        <div>Donor ID</div>
        <div>Amount</div>
        <div>Project ID</div>
        <div>Date</div>
      </div>
      {reverseArr(donations)
        .slice(page * perPage, (page + 1) * perPage)
        .map((donation) => {
          const { id, recipient_id, donor_id, donated_at_ms } = donation;
          return (
            <div className="donation-row">
              <div>{id}</div>
              <Widget
                src="near/widget/AccountProfileOverlay"
                props={{
                  accountId: donor_id,
                  children: (
                    <a
                      href={
                        "https://near.org/near/widget/ProfilePage?accountId=" +
                        donor_id
                      }
                      className="address"
                      target="_blank"
                    >
                      {_address(donor_id)}{" "}
                    </a>
                  ),
                }}
              />
              <div className="price">
                {calcDonations(donation).toFixed(2)}

                <img src={nearLogo} alt="NEAR" />
              </div>
              <Widget
                src="near/widget/AccountProfileOverlay"
                props={{
                  accountId: recipient_id,
                  children: (
                    <a
                      href={
                        "https://near.org/near/widget/ProfilePage?accountId=" +
                        recipient_id
                      }
                      className="address"
                      target="_blank"
                    >
                      {_address(recipient_id)}
                    </a>
                  ),
                }}
              />
              <div>{getTimePassed(donated_at_ms)} ago</div>
            </div>
          );
        })}
    </div>
    <Widget
      src="baam25.near/widget/pagination"
      props={{
        onClick: (page) => {
          setPage(page);
        },
        data: donations,
        page: page,
        perPage: perPage,
        bgColor: "var(--primary-color)",
      }}
    />
  </Container>
);
