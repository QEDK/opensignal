import { BigNumber } from "ethers";
import React, { useContext, useState } from "react";
import { GitcoinContext } from "../store";
import { Button, Container, Header, Input, Loader, Modal } from "semantic-ui-react";
import { validateNeutralNumber } from "../util/validators.util";

export const AddSignalModal = ({
    open,
    createLoading,
    onVisibilityChange,
    OnIncreaseSignal,
    project,
    projectMeta,
    onApprove,
    allowance,
    approveLoading,
}: {
    open: boolean;
    createLoading: boolean;
    onVisibilityChange: (i: boolean) => void;
    OnIncreaseSignal: (project: Project | null, amount: number) => void;
    project: Project | null;
    projectMeta: Project | null;
    onApprove: (amount: number) => void;
    allowance: number;
    approveLoading: boolean;
}) => {
    const { state } = useContext(GitcoinContext);
    const [amount, setAmount] = useState(0);

    const notEnoughAllowance = BigNumber.from(allowance || 0).lt(
        BigNumber.from((amount * 1e18).toString()),
    );

    const setByPerc = (perc = 0) => {
        setAmount(state.tokenBalance * (perc / 1e2));
    };
    return (
        <Modal
            size={"tiny"}
            onClose={() => onVisibilityChange(false)}
            onOpen={() => onVisibilityChange(true)}
            open={open}
            closeIcon
            style={{ borderRadius: "2rem" }}
        >
            <Modal.Header
                style={{
                    backgroundColor: "#e8e9ec",
                    borderTopLeftRadius: "2rem",
                    borderTopRightRadius: "2rem",
                }}
            >
                Increase Signal
            </Modal.Header>
            <Modal.Content>
                <Modal.Description style={{ padding: "0.5rem" }}>
                    <Header>Increase Signal</Header>
                    <div>
                        <div>
                            <Input
                                style={{ width: "100%" }}
                                type="number"
                                className="signal-amount"
                                value={amount || ""}
                                placeholder={"Enter Amount"}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                            ? validateNeutralNumber(e.target.value)
                                            : Number(amount),
                                    )
                                }
                            />
                        </div>
                        <div
                            style={{
                                width: "100%",
                                height: "2rem",
                                color: "#646464",
                                padding: "0.5rem 0",
                                fontSize: "0.75rem",
                                position: "relative",
                                display: "flex",
                            }}
                        >
                            {`Balance:  ${
                                Number(state.tokenBalance) < 0 ? "" : state.tokenBalance
                            }`}
                            <span
                                style={{
                                    width: "1rem",
                                    height: "1rem",
                                    position: "relative",
                                    display: "inline-flex",
                                }}
                            >
                                {Number(state.tokenBalance) < 0 ? (
                                    <Loader size="mini" active className="my-loader dark" />
                                ) : null}
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    border: "1px solid grey",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                                onClick={() => setByPerc(0)}
                            >
                                0%
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    border: "1px solid grey",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                                onClick={() => setByPerc(25)}
                            >
                                25%
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    border: "1px solid grey",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                                onClick={() => setByPerc(50)}
                            >
                                50%
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    border: "1px solid grey",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                                onClick={() => setByPerc(75)}
                            >
                                75%
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    border: "1px solid grey",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                                onClick={() => setByPerc(100)}
                            >
                                100%
                            </div>
                        </div>
                    </div>
                </Modal.Description>
            </Modal.Content>
            <div
                style={{
                    width: "100%",
                    padding: "1rem 2rem",
                    borderBottomLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                }}
            >
                {amount != 0 && notEnoughAllowance ? (
                    <Button
                        content="APPROVE"
                        loading={approveLoading}
                        onClick={() => onApprove(amount)}
                        className="my-btn signal-approve"
                    />
                ) : (
                    <Button
                        content={"Increase Signal"}
                        loading={createLoading}
                        onClick={() => OnIncreaseSignal(project, amount)}
                        className="my-btn green "
                    />
                )}
            </div>
        </Modal>
    );
};
