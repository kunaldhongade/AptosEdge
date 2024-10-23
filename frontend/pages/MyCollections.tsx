import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, message, Table, Tag, Typography } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";
const { Column } = Table;
const { Paragraph } = Typography;

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

export function MyCollections() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [policyById, setPolicyById] = useState<Policy | null>(null);
  const [policyID, setPolicyID] = useState<number | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policyAppliedBy, setPolicyAppliedBy] = useState<Policy[]>([]);

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleRequestClaim = async (values: { policy_id: number }) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::MicroInsuranceSystem::request_claim`,
          functionArguments: [values.policy_id],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Requested for Verification!");
      fetchAllPoliciesOnPlatform();
      fetchAllPoliciesByCustomer();
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
      console.log("Error Requesting Verification.", error);
    }
  };

  const handlePurchasePolicy = async (values: { policy_id: number }) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::MicroInsuranceSystem::purchase_policy`,
          functionArguments: [values.policy_id],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Purchase Successful!");
      fetchAllPoliciesOnPlatform();
      fetchAllPoliciesByCustomer();
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
      console.log("Error Purchasing Policy.", error);
    }
  };

  const fetchAllPoliciesOnPlatform = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::MicroInsuranceSystem::view_all_policies`,
        functionArguments: [],
      };

      const result = await aptosClient().view({ payload });

      const policyList = result[0];

      if (Array.isArray(policyList)) {
        setPolicies(
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
        setPolicies([]);
      }
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };
  const handleFetchPolicyById = () => {
    if (policyID !== null) {
      fetchPolicyById(policyID);
    } else {
      message.error("Please enter a valid Payments ID.");
    }
  };

  const fetchPolicyById = async (policy_id: number) => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::MicroInsuranceSystem::view_policy_by_id`,
        functionArguments: [policy_id],
      };
      const result = await aptosClient().view({ payload });
      const fetchedJob = result[0] as Policy;
      setPolicyById(fetchedJob);
    } catch (error) {
      console.error("Failed to fetch Policy by id:", error);
    }
  };

  const fetchAllPoliciesByCustomer = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::MicroInsuranceSystem::view_policies_by_customer`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const policyList = result[0];

      if (Array.isArray(policyList)) {
        setPolicyAppliedBy(
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
        setPolicyAppliedBy([]);
      }
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };

  useEffect(() => {
    fetchAllPoliciesOnPlatform();
    fetchAllPoliciesByCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, policies, policyAppliedBy]);

  return (
    <>
      <LaunchpadHeader title="All Policies" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>All Available Policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={policies} rowKey="" className="max-w-screen-xl mx-auto">
                <Column title="ID" dataIndex="id" />
                <Column title="Type" dataIndex="type_of_policy" responsive={["md"]} />
                <Column
                  title="Premium Amount"
                  dataIndex="premium_amount"
                  render={(premium_amount: number) => convertAmountFromOnChainToHumanReadable(premium_amount, 8)}
                />
                <Column title="Creator" dataIndex="creator" render={(creator: string) => creator.substring(0, 6)} />
                <Column
                  title="Description"
                  dataIndex="description"
                  responsive={["md"]}
                  render={(creator: string) => creator.substring(0, 300)}
                />
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Purchase Policy</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handlePurchasePolicy}
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
                    Purchase Policy
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>View Policy By ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                <Input
                  placeholder="Enter Policy ID"
                  type="number"
                  value={policyID || ""}
                  onChange={(e) => setPolicyID(Number(e.target.value))}
                  style={{ marginBottom: 16 }}
                />
                <Button
                  onClick={handleFetchPolicyById}
                  variant="submit"
                  size="lg"
                  className="text-base w-full"
                  type="submit"
                >
                  Fetch Policy
                </Button>
                {policyById && (
                  <Card key={policyById.policy_id} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Policy ID: {policyById.policy_id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      <div className="p-2">
                        <Card className="mb-6 shadow-lg p-4">
                          <p className="text-sm text-gray-500 mb-4">Policy ID: {policyById.policy_id}</p>
                          <Card style={{ marginTop: 16, padding: 16 }}>
                            <div>
                              <Paragraph>
                                <strong>Type:</strong> {policyById.type_of_policy}
                              </Paragraph>
                              <Paragraph>
                                <strong>Creator:</strong> <Tag>{policyById.creator}</Tag>
                              </Paragraph>
                              <Paragraph>
                                <strong>Premium Amount:</strong>{" "}
                                <Tag>{convertAmountFromOnChainToHumanReadable(policyById.premium_amount, 8)}</Tag>
                              </Paragraph>

                              <Paragraph>
                                <strong>Description:</strong> {policyById.description}
                              </Paragraph>

                              <Paragraph>
                                <strong>Claimable Amount:</strong>{" "}
                                <Tag>{convertAmountFromOnChainToHumanReadable(policyById.max_claimable, 8)}</Tag>
                              </Paragraph>

                              <Paragraph>
                                <strong>Total Premium Collected:</strong>{" "}
                                <Tag>
                                  {convertAmountFromOnChainToHumanReadable(policyById.total_premium_collected, 8)}
                                </Tag>
                              </Paragraph>

                              <Paragraph>
                                <strong>Payment Type:</strong> <Tag>{policyById.customers.length}</Tag>
                              </Paragraph>

                              <Paragraph>
                                <strong>Total Customers</strong> <Tag>{policyById.yearly ? "Annually" : "Once"}</Tag>
                              </Paragraph>

                              {policyById.customers.length > 0 ? (
                                <Card style={{ marginTop: 16, padding: 16 }}>
                                  {policyById.customers.map((customer, idx) => (
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
                          </Card>
                        </Card>
                      </div>
                    </Card>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Policies Purchased By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {policyAppliedBy.map((policy, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Policy ID: {policy.policy_id}</p>
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

                          <Button
                            onClick={() => handleRequestClaim({ policy_id: policy.id })}
                            variant="submit"
                            size="lg"
                            className="text-base w-full m-1"
                            type="submit"
                          >
                            Request Claim
                          </Button>
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get All Policies on Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {policies.map((policy, index) => (
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
