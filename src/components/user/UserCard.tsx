// components/dashboard/UserCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/context/AuthContext";
import OrderButton from "../ui/OrderButton";
import { useTranslations } from "next-intl";

interface UserCardProps {
  user: User;
  logout: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, logout }) => {
  const t = useTranslations("All.user.usercard");
  return (
    <div className="flex p-6">
      <Card className="bg-white text-black shadow-lg w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-0 text-gray-800 text-lg">
            {t("hello")}
            <span className="font-semibold">{user.username}</span>!
          </p>
          <p className="mb-6 text-gray-700">
            {t("yourCredits")}
            <span className="font-bold">{user.credit}</span>
            {t("credits")}
          </p>
          <div className="flex flex-row gap-2">
            <OrderButton className="bg-blue-500 hover:bg-blue-600 text-white" />
            <Button
              variant="outline"
              className="text-white bg-red-600 hover:bg-red-50"
              onClick={logout}
            >
              {t("logoutButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
