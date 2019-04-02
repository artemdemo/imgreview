type TStyled = {
    (el: any): any;
    button: any;
}

declare module 'styled-components' {
    const styled: TStyled;
    export = styled;
}
