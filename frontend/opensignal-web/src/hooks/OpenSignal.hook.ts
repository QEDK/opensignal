import {ethers} from 'ethers';
import React from 'react';
import {isAddress} from '../util/eth.util';
import makeBlockie from 'ethereum-blockies-base64';
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
                            .projectURI(id)
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
export {useGetProjectIds, useGetProjects, useGetProjectURI};
