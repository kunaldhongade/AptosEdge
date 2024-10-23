import { buttonVariants } from "@/components/ui/button";
import { Col, Grid, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export function Header() {
  const screens = useBreakpoint();

  return (
    <Row align="middle" justify="space-between" className="py-4 px-6 mx-auto w-full max-w-screen-xl">
      <Col>
        {/* Header Title */}
        <Title level={screens.xs ? 3 : screens.sm ? 2 : 1} className="m-0">
          <Link to="/" style={{ fontFamily: "unset", color: "inherit" }}>
            Aptos Insurance Platform
          </Link>
        </Title>
      </Col>

      <Col>
        {/* Flex container with even spacing */}
        <div className="flex gap-4 items-center justify-between">
          <Link
            className={`${buttonVariants({ variant: "link" })} w-24 text-center`} // Fixed width with center alignment
            to={"/create-insurance"}
          >
            Create Insurance
          </Link>
          <Link
            className={`${buttonVariants({ variant: "link" })} w-24 text-center`} // Fixed width with center alignment
            to={"/buy-insurance"}
          >
            Buy Insurance
          </Link>
          <div className="flex-shrink-0">
            <WalletSelector />
          </div>
        </div>
      </Col>
    </Row>
  );
}
