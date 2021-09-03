import {Container, Grid, Button, Icon} from 'semantic-ui-react';
import {useHistory} from 'react-router';
//@ts-ignore
import makeBlockie from 'ethereum-blockies-base64';
import {BigNumber} from 'ethers';
import {useGetOpenSignalContract} from '../hooks/Contract.hook';
import {GitcoinContext} from '../store';
import React from 'react';

const projects: Project[] = [
    {
        name: 'Polygon',
        signal: 2400,
        staked: 634,
        link: 'google.com',
        avatar: makeBlockie('0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8'),
    },
];
const ProjectPage = () => {
    const history = useHistory();
    const goToNewProject = () => {
        history.push('/projects/new');
    };

    return (
        <Container>
            <div className="page-header">
                <h3>Projects</h3>

                <span className="btn" onClick={goToNewProject}>
                    CREATE
                </span>
            </div>

            <Grid
                textAlign="center"
                verticalAlign="middle"
                style={{
                    marginTop: '2rem',
                }}
            >
                <div className="projects">
                    {projects.map((p, i) => (
                        <ProjectCard project={p} key={i} />
                    ))}
                </div>
            </Grid>
        </Container>
    );
};

export {ProjectPage};

const ProjectCard = ({project}: {project: Project}) => {
    const {state} = React.useContext(GitcoinContext);
    const [openSignalContract] = useGetOpenSignalContract(
        state.openSignalContract
    );
    const OnIncreaseSignal = () => {
        openSignalContract.methods
            .addSignal(state.wallets[0], BigNumber.from(10).pow(18))
            .send({
                from: state.wallets[0],
            })
            .then(console.log)
            .catch(console.log);
    };
    const OnDecreaseSignal = () => {
        openSignalContract.methods
            .removeSignal(state.wallets[0], BigNumber.from(10).pow(18))
            .send({
                from: state.wallets[0],
            })
            .then(console.log)
            .catch(console.log);
    };
    return (
        <div className="project">
            <h3>{project.name}</h3>

            <div className="project-avatar">
                <img src={project.avatar} />
            </div>
            <div className="project-actions">
                <Button.Group size="large">
                    <Button onClick={() => OnIncreaseSignal()}>
                        <Icon name="angle up" />
                    </Button>

                    <Button onClick={() => OnDecreaseSignal()}>
                        <Icon name="angle down" />
                    </Button>
                </Button.Group>
            </div>
            <div className="project-subheader">
                <p>
                    {`Signal: `} <span>{project.signal}</span>
                </p>
                <p>
                    {`Staked: `} <span>{project.staked}</span>
                </p>
            </div>
        </div>
    );
};
