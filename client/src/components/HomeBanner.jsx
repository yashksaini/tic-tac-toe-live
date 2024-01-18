import logo from "@assets/logo.png";
const HomeBanner = () => {
  return (
    <div
      className="flex-1 w-full  p-8 lg:flex justify-center items-center flex-col  hidden"
      style={{ background: "linear-gradient(to bottom, #191231, #253b58)" }}
    >
      <img src={logo} alt="Logo" className="w-80 h-80 " />
    </div>
  );
};

export default HomeBanner;
