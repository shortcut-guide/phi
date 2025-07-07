  export const getParsePageInt = () => {
    const regex = /^\/page\/(\d+)/;
    const match = regex.exec(location.pathname);
    return match ? parseInt(match[1], 10) : 1;
  };