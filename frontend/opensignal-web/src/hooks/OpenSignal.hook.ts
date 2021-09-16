import {ethers} from 'ethers';
import React from 'react';
import {isAddress} from '../util/eth.util';
import makeBlockie from 'ethereum-blockies-base64';
import {CONTRACTS} from './Contract.hook';
import Web3 from 'web3';
const TOPICS = ['NewProject(bytes32,string)'];
const useGetProjectIds = (contract: any, trigger = false) => {
    const [projects, setprojects] = React.useState<any[]>([]);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contract) {
            try {
                setloading(true);
                if (isAddress(contract._address)) {
                    setprojects([]);
                    setloading(true);
                    seterr(null);
                    try {
                        contract.methods
                            .allProjects()
                            .call()
                            .then((res: any) => {
                                setprojects(res);
                                setloading(false);
                                seterr(null);
                            })
                            .catch((err: any) => {
                                setprojects([]);
                                setloading(false);
                                seterr(err);
                            });
                    } catch (err) {
                        console.log('err', err);
                        setprojects([]);
                        setloading(false);
                        seterr(err);
                    }
                } else {
                    setprojects([]);
                    setloading(false);
                    seterr(null);
                }
            } catch (err) {
                setprojects([]);
                setloading(false);
                seterr(err);
            }
        }
    }, [trigger, contract]);
    return [projects, loading, err];
};

const useGetProjects = (ids: string[], contract: any, trigger = false) => {
    const [projects, setprojects] = React.useState<any[]>([]);
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contract) {
            try {
                setloading(true);

                if (isAddress(contract._address)) {
                    setprojects([]);
                    setloading(true);
                    seterr(null);
                    try {
                        Promise.all(
                            ids.map((id) =>
                                contract.methods.projects(id).call()
                            )
                        )
                            .then((res: any) => {
                                setprojects(
                                    res.map((r: any, i: number) => ({
                                        ...r,
                                        id: ids[i],
                                        avatar: makeBlockie(ids[i]),
                                    }))
                                );
                                setloading(false);
                                seterr(null);
                            })
                            .catch((err: any) => {
                                setprojects([]);
                                setloading(false);
                                seterr(err);
                            });
                    } catch (err) {
                        setprojects([]);
                        setloading(false);
                        seterr(err);
                    }
                } else {
                    setprojects([]);
                    setloading(false);
                    seterr(null);
                }
            } catch (err) {
                setprojects([]);
                setloading(false);
                seterr(err);
            }
        }
    }, [trigger, ids, contract]);
    return [projects, loading, err];
};
const useGetProjectURI = (id: string, contract: any, trigger = false) => {
    const [projectURI, setprojectURI] = React.useState<string>('');
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contract) {
            try {
                setloading(true);

                if (isAddress(contract._address)) {
                    setprojectURI('');
                    setloading(true);
                    seterr(null);
                    try {
                        contract.methods
                            .projectURIs(id)
                            .call()
                            .then((res: any) => {
                                setprojectURI(res);
                                setloading(false);
                                seterr(null);
                            })
                            .catch((err: any) => {
                                setprojectURI('');
                                setloading(false);
                                seterr(err);
                            });
                    } catch (err) {
                        setprojectURI('');
                        setloading(false);
                        seterr(err);
                    }
                } else {
                    setprojectURI('');
                    setloading(false);
                    seterr(null);
                }
            } catch (err) {
                setprojectURI('');
                setloading(false);
                seterr(err);
            }
        }
    }, [trigger, id, contract]);
    return [projectURI, loading, err];
};

const useGetreserveRatio = (contract: any, trigger = false) => {
    const [reserveRatio, setreserveRatio] = React.useState<string>('');
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (contract) {
            try {
                setloading(true);

                if (isAddress(contract._address)) {
                    setreserveRatio('');
                    setloading(true);
                    seterr(null);
                    try {
                        contract.methods
                            .reserveRatio()
                            .call()
                            .then((res: any) => {
                                setreserveRatio(res);
                                setloading(false);
                                seterr(null);
                            })
                            .catch((err: any) => {
                                setreserveRatio('');
                                setloading(false);
                                seterr(err);
                            });
                    } catch (err) {
                        setreserveRatio('');
                        setloading(false);
                        seterr(err);
                    }
                } else {
                    setreserveRatio('');
                    setloading(false);
                    seterr(null);
                }
            } catch (err) {
                setreserveRatio('');
                setloading(false);
                seterr(err);
            }
        }
    }, [trigger, contract]);
    return [reserveRatio, loading, err];
};

const useGetSaleReturn = (
    address?: string,
    totalSupply?: string,
    resetBalance?: string,
    reserveRatio?: string,
    sellAmount?: string,
    trigger: boolean = false
) => {
    const [saleReturn, setsaleReturn] = React.useState<string>('');
    const [loading, setloading] = React.useState<boolean>(false);
    const [err, seterr] = React.useState<any>(null);
    React.useMemo(async () => {
        if (
            // address &&
            // isAddress(address) &&
            totalSupply &&
            resetBalance &&
            reserveRatio &&
            sellAmount
        ) {
            setsaleReturn('');
            setloading(true);
            seterr(null);
            try {
                const contract = getbancorContract(
                    '0x11D6990f1aB66354189fe2477e547Deb86df16de'
                );

                const saleReturn = await contract.methods
                    .calculateSaleReturn(
                        totalSupply,
                        resetBalance,
                        reserveRatio,
                        ethers.utils.parseEther(sellAmount)
                    )
                    .call();
                console.log('saleReturn', saleReturn);
                setsaleReturn(ethers.utils.formatEther(saleReturn));
                setloading(false);
                seterr(null);
            } catch (err) {
                console.log('err123123', err);
                setsaleReturn('');
                setloading(false);
                seterr(err);
            }
        } else {
            setsaleReturn('');
            setloading(false);
            seterr(null);
        }
    }, [address, totalSupply, resetBalance, reserveRatio, sellAmount, trigger]);
    return [saleReturn, loading, err];
};

const getbancorContract = (deploymentAddr: string) => {
    let myweb3: any = new Web3(window.ethereum);
    return new myweb3.eth.Contract(CONTRACTS.BancorFormula.abi, deploymentAddr);
};

export {
    useGetProjectIds,
    useGetProjects,
    useGetProjectURI,
    useGetSaleReturn,
    useGetreserveRatio,
};
