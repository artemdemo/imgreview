// There is @types/styled-components in npm,
// but it doesn't allow to define `propTypes` for custom components.
// and it's freaking me out, so I created simple custom definition.
type TStyled = {
    (el: any): any;
    button: any;
}

declare module 'styled-components' {
    const styled: TStyled;
    export = styled;
}
