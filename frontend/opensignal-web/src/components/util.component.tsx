const BouncyBalls = (props: any) => {
  return (
    <div className={"boucny-balls"} {...props}>
      <h3 className="loading">Loading</h3>
      <div className={"boucny-balls-wrapper"}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export { BouncyBalls };
