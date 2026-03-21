export enum MessageStatus {
    SENT = 'SENT',
    RECEIVED = 'RECEIVED',
    READ = 'READ',
}

//Garantindo consistencia, evitando escrever string literals em varios lugares do codigo, e facilitando a manutencao futura, melhorando a legibilidade do codigo.