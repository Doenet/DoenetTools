// @ts-check
// We don't really need this file once we configure VSCode's eslint to run per workspace

import { createBaseConfig } from "@doenet-tools/eslint-config";

export default createBaseConfig(import.meta.dirname);
