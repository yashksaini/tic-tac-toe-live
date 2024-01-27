import logo from "@assets/logo.png";
// eslint-disable-next-line react/prop-types
const Banner = ({ bannerImage, heading, subheading }) => {
  return (
    <>
      <div className="h-40 w-full bg-dark2 rounded-b-full md:rounded-none">
        <div className="w-full flex flex-1 gap-1 justify-center items-center py-4">
          <img src={logo} alt="Logo" className="w-10 h-10 " />
          <span className="text-white text-xl font-bold tracking-tighter mt-[4px]">
            CONNECT
          </span>
        </div>
        <img
          src={bannerImage}
          alt="Banner"
          className="m-auto w-40 h-40 rounded-full shadow-md"
        />
      </div>
      <div className="w-full mt-20">
        <h1 className="w-full text-center text-2xl text-dark1 font-bold">
          {heading}
        </h1>
        <p className="w-full text-center text-xl text-gray-500 font-medium">
          {subheading}
        </p>
      </div>
    </>
  );
};

export default Banner;
