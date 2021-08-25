const fakeAddress = "0x9B00B2A3514CC05Ea9957ad5e4D279D724a81Afb";
const fakeDeployAddress = "0x5512F2748C921935C434D5a449a865E7F1Eb0b9a";
const selfStage = 1;
const signal = 1;
const timestamp = Date.now();
const fakeAvatars = [
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  "https://monsterspost.com/wp-content/uploads/2019/11/polygen-app.jpg",
  "https://camo.githubusercontent.com/e4bc264a7884c5fee9fedf0fc8fe17dc3a65ca5d1f9e045697f8ec27b2e68d2b/687474703a2f2f7370656e63657274697070696e672e636f6d2f6e6f74652d77616c6c70617065722d312e6a7067",
  "https://previews.123rf.com/images/tonsofbackgrounds/tonsofbackgrounds1707/tonsofbackgrounds170700263/82571058-random-strokes-texture-colorful-background-with-blue-pink-colors-background-design-in-high-resolutio.jpg",
  "https://w.wallhaven.cc/full/pk/wallhaven-pkw6y3.jpg",
  "https://w.wallhaven.cc/full/z8/wallhaven-z8odwg.jpg",
];

const getFakeAvatar = (i = 0) => {
  return fakeAvatars[i % fakeAvatars.length];
};
const projects = [1, 2, 3, 4, 5, 6, 7].map(i => {
  return {
    name: "Fake Project #" + i,
    creator: fakeAddress,
    deployment: fakeDeployAddress,
    selfstake: selfStage,
    signal: signal,
    timestamp: timestamp,

    image: getFakeAvatar(i),
  };
});

const useGetProjects = () => {
  return projects;
};
const AddProject = async ({ name, creator, deployment, signal, selfstake, timestamp }, imageUrl) => {
  projects.unshift({
    name: name,
    creator: creator || fakeAddress,
    deployment: deployment || fakeDeployAddress,
    selfstake: selfstake || 1,
    signal: signal || 1,
    timestamp: timestamp || Date.now(),

    image: imageUrl || getFakeAvatar(Math.floor(fakeAvatars.length * Math.random())),
  });
};
export { useGetProjects, AddProject };
