const ServerPage = ({ params }: { params: { serverId: string } }) => {
  const { serverId } = params;

  return <div>Server Id Page {serverId}</div>;
};

export default ServerPage;
