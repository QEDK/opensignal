import { BigNumber, ethers } from "ethers";
import React, { useContext, useState } from "react";
import { GitcoinContext } from "../store";
import { Button, Container, Header, Input, Loader, Modal } from "semantic-ui-react";
import { validateNeutralNumber } from "../util/validators.util";
import {
    getShareContract,
    useGetShareAllowance,
    useGetShareBalance,
    useGetTotalSupply,
} from "../hooks/OpenSignalShares";
import { useGetSaleReturn } from "../hooks/OpenSignal.hook";
export const RmoveSignalModal = ({
    reserveRatio,
    open,
    onVisibilityChange,
    createLoading,
    approveLoading,
    onApprove,
    OnDecreaseSignal,
    project,
    projectMeta,
    wallet,
    contract,
}: {
    reserveRatio: string;
    open: boolean;
    onVisibilityChange: (i: boolean) => void;
    createLoading: boolean;
    approveLoading: boolean;
    onApprove: (address: string, i: number) => void;
    OnDecreaseSignal: (project: Project | null, amount: number, minAmount: number) => void;
    project: Project | null;
    projectMeta: Project | null;
    wallet: string;
    contract: any;
}) => {
    const [amount, setAmount] = useState(0);

    const [shareBalance, shareBalanceLoading, err] = useGetShareBalance(
        project?.deployment,
        wallet,
        createLoading,
    );

    const [shareAllowance, shareAllowanceLoading] = useGetShareAllowance(
        contract?._address,
        project?.deployment,
        wallet,
        approveLoading,
    );

    const [totalSupply, totalSupplyLoading, totalSupplyErr] = useGetTotalSupply(
        project?.deployment,
    );

    const [saleReturn, saleReturnLoading] = useGetSaleReturn(
        "TODO",
        project?.signal.toString() || "",
        totalSupply,
        reserveRatio,
        amount.toString(),
    );

    const notEnoughAllowance = BigNumber.from(shareAllowance || "0").lt(
        ethers.utils.parseEther((amount || "0").toString()),
    );

    const setByPerc = (perc = 0) => {
        setAmount(shareBalance * (perc / 1e2));
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
                Decrease Signal
            </Modal.Header>
            <Modal.Content>
                <Modal.Description style={{ padding: "0.5rem" }}>
                    <Header>Decrease Signal</Header>
                    <div>
                        <div>
                            <Input
                                style={{ width: "100%" }}
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
                            {`Your stake:  ${Number(shareBalance) < 0 ? "" : shareBalance}`}
                            <span
                                style={{
                                    width: "1rem",
                                    height: "1rem",
                                    position: "relative",
                                    display: "inline-flex",
                                }}
                            >
                                {Number(shareBalance) < 0 ? (
                                    <Loader size="mini" active className="my-loader dark" />
                                ) : null}
                            </span>
                        </div>{" "}
                        <div
                            style={{
                                width: "100%",
                                height: "2rem",
                                color: "#646464",

                                fontSize: "0.75rem",
                                position: "relative",
                                display: "flex",
                            }}
                        >
                            {`Sale return:  ${
                                !saleReturnLoading && Number(saleReturn) > -1 ? saleReturn : ""
                            }`}
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
                        color="violet"
                        loading={approveLoading || shareAllowanceLoading}
                        content="APPROVE"
                        onClick={() => onApprove(project?.deployment || "", amount)}
                        className="my-btn signal-approve"
                    />
                ) : (
                    <Button
                        content={"Decrease Signal"}
                        loading={createLoading || totalSupplyLoading || saleReturnLoading}
                        onClick={() => OnDecreaseSignal(project, amount, saleReturn)}
                        className="my-btn red"
                    />
                )}
            </div>
        </Modal>
    );
};
