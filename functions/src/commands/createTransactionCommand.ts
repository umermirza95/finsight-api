import {FSTransactionMode, FSTransactionSubType, FSTransactionType} from "../interface/FSTransaction";

export default interface ICreateTransactionCommand {
    id?:string,
    amount: number;
    addProcessingFee: boolean;
    categoryId: string;
    subCategoryId?: string
    currency?: string,
    comment?: string,
    date: Date;
    type: FSTransactionType;
    subType?: FSTransactionSubType;
    mode: FSTransactionMode;
    useLiveFx?: boolean
}
