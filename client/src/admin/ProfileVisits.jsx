import serverUsers from "@assets/server_users.jpg";
import Banner from "../components/Banner";
const ProfileVisits = () => {
  return (
    <>
      <Banner
        bannerImage={serverUsers}
        heading={"Profile visited by"}
        subheading={"#profilevisitors"}
      />
    </>
  );
};

export default ProfileVisits;
