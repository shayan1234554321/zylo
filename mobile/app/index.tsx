import { useGlobalContext } from "@/context/GlobalProvider";
import { Href, Redirect } from "expo-router";

const Page = () => {
  const { user } = useGlobalContext();

  if (user)
    return <Redirect href={"/(root)/(tabs)/home" as Href<string | object>} />;

  return <Redirect href={"/(auth)/welcome" as Href<string | object>} />;
};

export default Page;
