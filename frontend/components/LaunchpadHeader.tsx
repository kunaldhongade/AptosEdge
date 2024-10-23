import { Col, Grid, Row, Typography } from "antd";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import { WalletSelector } from "@/components/WalletSelector";
import { buttonVariants } from "@/components/ui/button";

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface LaunchpadHeaderProps {
  title: string;
}

export const LaunchpadHeader: FC<LaunchpadHeaderProps> = ({ title }) => {
  const location = useLocation();
  const screens = useBreakpoint();

  return (
    <Row align="middle" justify="space-between" className="py-4 px-6 mx-auto w-full max-w-screen-xl">
      <Col>
        {/* Responsive Title */}
        <Title level={screens.xs ? 3 : screens.sm ? 2 : 1} className="m-0">
          {title}
        </Title>
      </Col>

      <Col>
        {/* Flex container with fixed width for links */}
        <div className="flex gap-4 items-center justify-between">
          <Link
            className={`${buttonVariants({ variant: "link" })} w-24 text-center`} // Fixed width with center alignment
            to={"/"}
          >
            Home
          </Link>
          {location.pathname === "/buy-insurance" ? (
            <Link
              className={`${buttonVariants({ variant: "link" })} w-24 text-center`} // Fixed width with center alignment
              to={"/create-insurance"}
            >
              Create Insurance
            </Link>
          ) : (
            <Link
              className={`${buttonVariants({ variant: "link" })} w-24 text-center`} // Fixed width with center alignment
              to={"/buy-insurance"}
            >
              Buy Insurance
            </Link>
          )}
          <div className="flex-shrink-0">
            {" "}
            {/* Prevents shrinking for the wallet selector */}
            <WalletSelector />
          </div>
        </div>
      </Col>
    </Row>
  );
};
