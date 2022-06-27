import type { SubcommandMappingArray, SubcommandMappingMethod } from '@sapphire/plugin-subcommands';

export function MessageSubcommand(name: string): MethodDecorator {
	return (target: any, propertyKey: string | symbol) => {
		if (!Reflect.has(target, 'subcommandMappings')) Reflect.set(target, 'subcommandMappings', []);
		const mappings: SubcommandMappingArray = Reflect.get(target, 'subcommandMappings');
		const subcommand = mappings.find((mapping) => mapping.name === name);
		if (subcommand) {
			(subcommand as any).messageRun = propertyKey;
		} else {
			mappings.push({
				name,
				type: 'method',
				messageRun: propertyKey as any
			});
		}
	};
}

export function ChatInputSubcommand(name: string): MethodDecorator {
	return (target: any, propertyKey: string | symbol) => {
		if (!Reflect.has(target, 'subcommandMappings')) Reflect.set(target, 'subcommandMappings', []);
		const mappings: SubcommandMappingArray = Reflect.get(target, 'subcommandMappings');
		const subcommand = mappings.find((mapping) => mapping.name === name);
		if (subcommand) {
			(subcommand as any).chatInputRun = propertyKey;
		} else {
			mappings.push({
				name,
				type: 'method',
				chatInputRun: propertyKey as any
			});
		}
	};
}

export function ChatInputGroupSubcommand(group: string, name: string) {
	return (target: any, propertyKey: string | symbol) => {
		if (!Reflect.has(target, 'subcommandMappings')) Reflect.set(target, 'subcommandMappings', []);
		const mappings: SubcommandMappingArray = Reflect.get(target, 'subcommandMappings');
		const cmdgroup = mappings.find((mapping) => mapping.name === group);
		if (cmdgroup && cmdgroup.type === 'group') {
			if (cmdgroup.entries.some((entry: SubcommandMappingMethod) => entry.name === name)) {
				const cmd = cmdgroup.entries.find((entry: SubcommandMappingMethod) => entry.name === name)!;
				cmd.chatInputRun = propertyKey as any;
			} else {
				cmdgroup.entries.push({
					name,
					chatInputRun: propertyKey as any
				});
			}
		} else {
			mappings.push({
				name: group,
				type: 'group',
				entries: [
					{
						name,
						chatInputRun: propertyKey as any
					}
				]
			});
		}
	};
}

export function MessageGroupSubcommand(group: string, name: string) {
	return (target: any, propertyKey: string | symbol) => {
		if (!Reflect.has(target, 'subcommandMappings')) Reflect.set(target, 'subcommandMappings', []);
		const mappings: SubcommandMappingArray = Reflect.get(target, 'subcommandMappings');
		const cmdgroup = mappings.find((mapping) => mapping.name === group);
		if (cmdgroup && cmdgroup.type === 'group') {
			if (cmdgroup.entries.some((entry: SubcommandMappingMethod) => entry.name === name)) {
				const cmd = cmdgroup.entries.find((entry: SubcommandMappingMethod) => entry.name === name)!;
				cmd.messageRun = propertyKey as any;
			} else {
				cmdgroup.entries.push({
					name,
					messageRun: propertyKey as any
				});
			}
		} else {
			mappings.push({
				name: group,
				type: 'group',
				entries: [
					{
						name,
						messageRun: propertyKey as any
					}
				]
			});
		}
	};
}
