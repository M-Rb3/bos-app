const [allDonations, setAllDonations] = useState([]);

const nearToUsd = useCache(
  () =>
    asyncFetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
    ).then((res) => {
      if (res.ok) {
        return res.body.near.usd;
      }
    }),
  "nearToUsd"
);
if (!allDonations.length) {
  return Near.asyncView("donate.potlock.near", "get_donations_for_donor", {
    donor_id: "v1.foodbank.near",
  })
    .then((donations) => {
      setAllDonations(donations);
    })
    .catch((err) => {
      console.log("err fetchign donations", err);
    });
}

const [page, setPage] = useState(0);
const perPage = 30;

const nearLogo =
  "https://ipfs.near.social/ipfs/bafkreib2cfbayerbbnoya6z4qcywnizqrbkzt5lbqe32whm2lubw3sywr4";

const { getTimePassed, _address, reverseArr } = VM.require(
  `potlock.near/widget/Components.DonorsUtils`
) || {
  getTimePassed: () => "",
  _address: () => "",
  reverseArr: () => [],
};

const yoctosToNear = (amount) => Big(amount).div(Big(10).pow(24));

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  .transcation {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 1rem;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      gap: 1rem;
      background: #ec2109;
      color: white;
      div {
        width: 110px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
      }
    }
    .address {
      width: 160px !important;
    }
  }
  @media only screen and (max-width: 768px) {
    .transcation {
      font-size: 12px;
      .header {
        padding: 10px 0;
        div {
          width: 80px !important;
        }
      }
      .address {
        justify-content: center;
      }
    }
  }
  @media only screen and (max-width: 480px) {
    .transcation {
      font-size: 9px;
    }
  }
`;

const TrRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 1rem;
  padding: 20px 10px;

  > div,
  > span {
    width: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .price {
    display: flex;
    gap: 1rem;
    align-items: center;
    img {
      width: 1.25rem;
    }
  }
  .address {
    color: #292929;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 2px;
    transition: all 200ms;
    .profile-image {
      width: 2rem;
      height: 2rem;
      margin-right: 1rem;
    }
  }
  @media only screen and (max-width: 768px) {
    padding: 10px 0;
    > div,
    > span {
      width: 80px;
    }
    .price {
      gap: 8px;
      img {
        width: 1rem;
      }
    }
    .address .profile-image {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
    }
  }
  @media only screen and (max-width: 480px) {
    .price img {
      width: 0.75rem;
    }
  }
`;

const NoResult = styled.div`
  font-size: 2rem;
  text-align: center;
`;

const ProfileImg = ({ address }) => (
  <Widget
    src="mob.near/widget/ProfileImage"
    props={{ accountId: address, style: {} }}
  />
);

const getUrl = (params) => `https://app.potlock.org/${params}`;

return allDonations.length ? (
  <Container>
    <div className="transcation">
      <div className="header">
        <div className="address">Project</div>
        <div>Amount</div>
        {nearToUsd && <div>Amount (USD)</div>}
        <div>Date</div>
      </div>
      {reverseArr(allDonations)
        .slice(page * perPage, (page + 1) * perPage)
        .map((donation) => {
          const {
            recipient_id,
            donated_at_ms,
            donated_at,
            project_id,
            total_amount,
          } = donation;
          const projectId = recipient_id || project_id;
          const totalAmount = yoctosToNear(total_amount);
          return (
            <TrRow>
              <a
                href={getUrl(`?tab=project&projectId=${projectId}`)}
                className="address"
                target="_blank"
              >
                <ProfileImg address={projectId} />
                {_address(projectId)}
              </a>

              <div className="price">
                <img src={nearLogo} alt="NEAR" />
                {totalAmount.toFixed(2)}
              </div>
              {nearToUsd && <div>~${(totalAmount * nearToUsd).toFixed(2)}</div>}

              <div>{getTimePassed(donated_at_ms || donated_at)} ago</div>
            </TrRow>
          );
        })}
    </div>
    <Widget
      src="baam25.near/widget/pagination"
      props={{
        onClick: (page) => {
          setPage(page);
        },
        data: allDonations,
        page: page,
        perPage: perPage,
        bgColor: "#ec2109",
      }}
    />
  </Container>
) : (
  <NoResult>No Donations</NoResult>
);
