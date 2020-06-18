interface Icomponent{
    tempContainer: HTMLElement;
    init: () => void;
    template: () => void;
    handle: () => void;
}

export default Icomponent;