import { app } from "@luminix/core";
import Component from "./facades/Component";

app().on('init', ({ source }) => {
    source.bind('cms.component', new Component());
});
