import PropTypes from "prop-types";

export default function Loading(props: any) {
  const { isShowLoading } = props;
  const loader = "1";

  if (isShowLoading) {
    return (
      <>
        <div
          className={
            "loader_overlay animated " + (loader === "1" ? "fadeIn" : "")
          }
        >
          <div className="colorful center"></div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

Loading.propTypes = {
  isShowLoading: PropTypes.bool.isRequired,
};
