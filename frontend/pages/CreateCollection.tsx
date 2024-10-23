/* eslint-disable react-hooks/exhaustive-deps */
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { RadioChangeEvent } from "antd";
import { Form, message, Radio, Select, Space, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [policyCreatedBy, setPolicyCreatedBy] = useState<Policy[]>([]);

  const [value, setValue] = useState(true);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  interface Policy {
    id: number;
    description: string;
    premium_amount: number;
    yearly: boolean;
    type_of_policy: string;
    claimable_amount: number;
    max_claimable: number;
    total_premium_collected: number;
    creator: string;
    customers: {
      customer: string;
      is_claimed: boolean;
      is_requested: boolean;
      is_verified: boolean;
      premium_paid: boolean;
    }[];
    policy_id: number;
  }

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleCreatePolicy = async (values: Policy) => {
    try {
      const premiumAMT = convertAmountFromHumanReadableToOnChain(values.premium_amount, 8);
      const maxClaimable = convertAmountFromHumanReadableToOnChain(values.max_claimable, 8);

      if (!values.description) {
        values.description = "None";
      }

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::MicroInsuranceSystem::create_policy`,
          functionArguments: [values.description, premiumAMT, values.yearly, maxClaimable, values.type_of_policy],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Policy is Created Successfully!");
      fetchAllPoliciesByCreator();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error creating Policy.", error);
    }
  };

  const handleVerifyClaim = async (values: { policy_id: number; customer: string }) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::MicroInsuranceSystem::verify_claim`,
          functionArguments: [values.policy_id, values.customer],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Claim is Verified!");
      fetchAllPoliciesByCreator();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error Verifying Claim.", error);
    }
  };

  const handlePayoutClaim = async (values: Policy) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::MicroInsuranceSystem::payout_claim`,
          functionArguments: [values.policy_id],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Payout is Successful!");
      fetchAllPoliciesByCreator();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error Paying Claim.", error);
    }
  };

  const fetchAllPoliciesByCreator = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::MicroInsuranceSystem::view_policies_by_creator`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const policyList = result[0];

      if (Array.isArray(policyList)) {
        setPolicyCreatedBy(
          policyList.map((policy) => ({
            claimable_amount: policy.claimable_amount,
            creator: policy.creator,
            customers: policy.customers.map(
              (customer: {
                customer: string;
                is_claimed: boolean;
                is_requested: boolean;
                is_verified: boolean;
                premium_paid: boolean;
              }) => ({
                customer: customer.customer,
                is_claimed: customer.is_claimed,
                is_requested: customer.is_requested,
                is_verified: customer.is_verified,
                premium_paid: customer.premium_paid,
              }),
            ),
            description: policy.description,
            policy_id: policy.policy_id,
            id: policy.id,
            max_claimable: policy.max_claimable,
            premium_amount: policy.premium_amount,
            total_premium_collected: policy.total_premium_collected,
            type_of_policy: policy.type_of_policy,
            yearly: policy.yearly,
          })),
        );
      } else {
        setPolicyCreatedBy([]);
      }
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };

  useEffect(() => {
    fetchAllPoliciesByCreator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, fetchAllPoliciesByCreator]);

  return (
    <>
      <LaunchpadHeader title="Create Insurance Policy" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Create Policy</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleCreatePolicy}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item name="type_of_policy" label="Type of Policy" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="Car_Insurance">Car Insurance</Select.Option>
                    <Select.Option value="Bike_Insurance">Bike Insurance</Select.Option>
                    <Select.Option value="Home_Insurance">Home Insurance</Select.Option>
                    <Select.Option value="Life_Insurance">Life Insurance</Select.Option>
                    <Select.Option value="Term_Insurance">Term Insurance</Select.Option>
                    <Select.Option value="Other_Insurance">Other Insurance</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                  <Input placeholder="Enter Description" />
                </Form.Item>

                <Form.Item label="Premium Amount" name="premium_amount" rules={[{ required: true }]}>
                  <Input placeholder="Enter Your Premium Amount" />
                </Form.Item>

                <Form.Item label="Claim Amount" name="max_claimable" rules={[{ required: true }]}>
                  <Input placeholder="Enter Your Claim Amount" />
                </Form.Item>

                <Form.Item label="Choose Premium type" name="yearly" rules={[{ required: true }]}>
                  <Radio.Group onChange={onChange} value={value}>
                    <Space direction="horizontal">
                      <Radio value={true}>Yearly</Radio>
                      <Radio value={false}>Only Once</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Create Insurance
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Verify Claim</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleVerifyClaim}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Policy ID" name="policy_id" rules={[{ required: true }]}>
                  <Input placeholder="eg. 1001" />
                </Form.Item>

                <Form.Item label="Customer Address" name="customer" rules={[{ required: true }]}>
                  <Input placeholder="eg. 0x0" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Verify Claim
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Payout All Claim</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handlePayoutClaim}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Policy ID" name="policy_id" rules={[{ required: true }]}>
                  <Input placeholder="eg. 1001" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Pay All Claims
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Policies Created By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {policyCreatedBy.map((policy, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Policy ID: {policy.id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      {policy && (
                        <div>
                          <Paragraph>
                            <strong>Type:</strong> {policy.type_of_policy}
                          </Paragraph>
                          <Paragraph>
                            <strong>Creator:</strong> <Tag>{policy.creator}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>Premium Amount:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(policy.premium_amount, 8)}</Tag>
                          </Paragraph>

                          <Paragraph>
                            <strong>Description:</strong> {policy.description}
                          </Paragraph>

                          <Paragraph>
                            <strong>Claimable Amount:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(policy.max_claimable, 8)}</Tag>
                          </Paragraph>

                          <Paragraph>
                            <strong>Total Premium Collected:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(policy.total_premium_collected, 8)}</Tag>
                          </Paragraph>

                          <Paragraph>
                            <strong>Payment Type:</strong> <Tag>{policy.customers.length}</Tag>
                          </Paragraph>

                          <Paragraph>
                            <strong>Total Customers</strong> <Tag>{policy.yearly ? "Annually" : "Once"}</Tag>
                          </Paragraph>

                          {policy.customers.length > 0 ? (
                            <Card style={{ marginTop: 16, padding: 16 }}>
                              {policy.customers.map((customer, idx) => (
                                <div key={idx} className="mb-4">
                                  <Paragraph>
                                    <strong>Customer:</strong> <Tag>{customer.customer}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Claimed:</strong> <Tag>{customer.is_claimed ? "Yes" : "No"}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Requested:</strong> <Tag>{customer.is_requested ? "Yes" : "No"}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Verified:</strong> <Tag>{customer.is_verified ? "Yes" : "No"}</Tag>
                                  </Paragraph>
                                  <Paragraph>
                                    <strong>Premium Paid:</strong> <Tag>{customer.premium_paid ? "Yes" : "No"}</Tag>
                                  </Paragraph>
                                </div>
                              ))}
                            </Card>
                          ) : (
                            <Paragraph>No Customers Found for this Policy. </Paragraph>
                          )}
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
