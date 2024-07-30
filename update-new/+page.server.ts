import { Property } from "../../../contracts/property";
import { DefaultProvider, PubKeyHash, bsv } from "scrypt-ts";
import { NeucronSigner } from "neucron-signer";
import type { RequestEvent } from '@sveltejs/kit';

// Initialize the provider and signer
const provider = new DefaultProvider({ network: bsv.Networks.mainnet });
const signer = new NeucronSigner(provider);

// Parse form data from the request event
const parseFormData = async (requestEvent: RequestEvent) => {
    const data = await requestEvent.request.formData();
    return {
        propertyId: data.get("propertyId") as string,
        latitude: data.get("latitude") as string,
        longitude: data.get("longitude") as string,
        areaCity: data.get("areaCity") as string,
        stateSelected: data.get("state") as string,
        ownerPublicAddress: PubKeyHash(data.get("ownerPublicAddress") as string),
        defaultBidAmount: BigInt(data.get("defaultBidAmount") as string),
    };
};

// Connect to the signer
const connectSigner = async () => {
    try {
        await signer.login('sales@timechainlabs.io', "string"); // Ensure proper credentials
    } catch (error) {
        console.error('Failed to connect signer:', error);
        throw new Error('NeucronSigner connection failed');
    }
};

// Deploy the smart contract
const deployContract = async (
    propertyId: string,
    latitude: string,
    longitude: string,
    areaCity: string,
    stateSelected: string,
    ownerPublicAddress: PubKeyHash,
    defaultBidAmount: bigint
) => {
    await Property.loadArtifact();

    const instance = new Property(
        Buffer.from(propertyId, 'utf8').toString('hex'),
        Buffer.from(latitude, 'utf8').toString('hex'),
        Buffer.from(longitude, 'utf8').toString('hex'),
        Buffer.from(areaCity, 'utf8').toString('hex'),
        Buffer.from(stateSelected, 'utf8').toString('hex'),
        ownerPublicAddress,
        defaultBidAmount,
        Buffer.from('', 'utf8').toString('hex') // No document URL required
    );

    await instance.connect(signer);
    const deployTx = await instance.deploy();
    console.log("Smart contract deployed: https://whatsonchain.com/tx/" + deployTx.id);

    return deployTx.id;
};

// Export the actions for deployment
export const actions = {
    deploy: async (event: RequestEvent) => {
        if (event.request.method !== 'POST') {
            return { deployed: false, error: 'Invalid request method' };
        }
        
        try {
            const formData = await parseFormData(event);
            const { propertyId, latitude, longitude, areaCity, stateSelected, ownerPublicAddress, defaultBidAmount } = formData;

            if (!propertyId || !latitude || !longitude || !areaCity || !stateSelected || !ownerPublicAddress || !defaultBidAmount) {
                return { deployed: false, error: 'Missing required fields' };
            }

            await connectSigner();
            const txid = await deployContract(propertyId, latitude, longitude, areaCity, stateSelected, ownerPublicAddress, defaultBidAmount);

            return { deployed: true, txid };
        } catch (error) {
            console.error('Deployment failed:', error);
            return { deployed: false, error: error.message || 'Deployment failed' };
        }
    },
};
