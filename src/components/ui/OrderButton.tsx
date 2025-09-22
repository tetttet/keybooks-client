import React from "react";
import { Button } from "./button";
import { useTranslations } from "next-intl";
import { whatsappNumber } from "@/constants/data";

interface OrderButtonProps extends React.ComponentProps<typeof Button> {
  className?: string;
}

const OrderButton: React.FC<OrderButtonProps> = ({ className, ...props }) => {
  const t = useTranslations("All.button");

  const handleClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  return (
    <Button
      variant="outline"
      className={`px-3 text-[12px] h-[35px] ${className}`}
      onClick={handleClick}
      {...props}
    >
      {t("orderNow")}
    </Button>
  );
};

export default OrderButton;
