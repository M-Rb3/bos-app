const perPage = props.perPage || 50;
const data = props.data || [];
const bgColor = props.bgColor || "#aeaeae";
const customStyle = props.customStyle || "";
const onClick = props.onClick || "";
const page = props.page || 0;
// list of pages
const paginations = [
  ...Array(
    parseInt(data?.length / perPage) + (data?.length % perPage > 0 ? 1 : 0)
  ).keys(),
];
let lastElement = paginations[paginations.length - 1];
const handlePainate = (to) => {
  if (to !== "...") {
    const nxtPage = parseInt(to);
    onClick(nxtPage);
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

const Pagination = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  ${customStyle}
  div {
    border: 1px solid transparent;
    background: ${bgColor};
    border-radius: 2px;
    padding: 10px;
    font-size: 12px;
    color: white;
    cursor: pointer;
    transition: all 300ms;
    :hover {
      opacity: 0.75;
    }
    &.active {
      background: white;
      color: ${bgColor};
      border-color: ${bgColor};
    }
  }
`;
const PaginationNumber = () => {
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

return paginations.length === 1 ? "" : <PaginationNumber />;
