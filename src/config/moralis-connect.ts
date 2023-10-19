//Contracts Access
const contracts: {
    token: string;
    auction: string;
    collection: string;
} = { 
    token: "0x11142365DDbc92C3547b8A074289409B5432CA8b",
    auction: '0xdfCf40b02ac997106e23107A7D5fbEBfCC14fe46',
    collection: "0x898f43A357709A8fb39EaE57d23C281793d9ee94", 
}

const chainID: {

    mainNet: string 
    testNet: string 

} = {
    mainNet: '',
    testNet: '0x13881'
}


export { 
    contracts,
    chainID
};