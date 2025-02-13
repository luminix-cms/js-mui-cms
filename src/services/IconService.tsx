import { Model } from "@luminix/core";
import { Str } from "@luminix/support";

type IconComponent = {
    name: string;
    component: React.ComponentType;
}

class IconService 
{

    private icons: IconComponent[] = [];

    constructor(/* protected app: ApplicationInterface */) {
        // Register default icons
        // app.once('booting', () => {
        Model.reducer(
            'model',
            (Base) => {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const iconService = this;
                return class extends Base {
                    static icon() {
                        return iconService.render('CategoryOutlined');
                    }
                }
            },
            0
        );
        // });
    }

    forModel(model: string, icon: string) {
        // this.app.once('booting', () => {
        Model.reducer(`model${Str.studly(model)}`, (Base) => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const iconService = this;
            return class extends Base {
                static icon() {
                    return iconService.render(icon);
                }

            }
        });
        // });
    }


    registerIcon(iconMap: Record<string, React.ComponentType>): void;
    registerIcon(name: string, component: React.ComponentType): void;
    registerIcon(name: string | Record<string, React.ComponentType>, component?: React.ComponentType) {
        if (typeof name === 'string' && component) {
            this.icons.push({ name, component });
        } else {
            Object.entries(name).forEach(([name, component]) => {
                this.icons.push({ name, component });
            });
        }
    }

    make(name: string): React.ComponentType {
        return this.icons.find((icon) => icon.name === name)!.component;
    }

    render(name: string, props: Record<string, unknown> = {}): React.ReactNode {
        const Icon = this.make(name);

        if (!Icon) {
            return null;
        }

        return <Icon {...props} />;
    }

    all(): string[] {
        return this.icons.map((icon) => icon.name);
    }

}

export default IconService;
