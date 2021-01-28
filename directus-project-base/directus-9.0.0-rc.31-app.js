"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = __importDefault(require("./logger"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const validate_env_1 = require("./utils/validate-env");
const env_1 = __importDefault(require("./env"));
const track_1 = require("./utils/track");
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const cors_1 = __importDefault(require("./middleware/cors"));
const rate_limiter_1 = __importDefault(require("./middleware/rate-limiter"));
const cache_1 = __importDefault(require("./middleware/cache"));
const extract_token_1 = __importDefault(require("./middleware/extract-token"));
const authenticate_1 = __importDefault(require("./middleware/authenticate"));
const activity_1 = __importDefault(require("./controllers/activity"));
const assets_1 = __importDefault(require("./controllers/assets"));
const auth_1 = __importDefault(require("./controllers/auth"));
const collections_1 = __importDefault(require("./controllers/collections"));
const extensions_1 = __importDefault(require("./controllers/extensions"));
const fields_1 = __importDefault(require("./controllers/fields"));
const files_1 = __importDefault(require("./controllers/files"));
const folders_1 = __importDefault(require("./controllers/folders"));
const items_1 = __importDefault(require("./controllers/items"));
const permissions_1 = __importDefault(require("./controllers/permissions"));
const presets_1 = __importDefault(require("./controllers/presets"));
const relations_1 = __importDefault(require("./controllers/relations"));
const revisions_1 = __importDefault(require("./controllers/revisions"));
const roles_1 = __importDefault(require("./controllers/roles"));
const server_1 = __importDefault(require("./controllers/server"));
const settings_1 = __importDefault(require("./controllers/settings"));
const users_1 = __importDefault(require("./controllers/users"));
const utils_1 = __importDefault(require("./controllers/utils"));
const webhooks_1 = __importDefault(require("./controllers/webhooks"));
const graphql_1 = __importDefault(require("./controllers/graphql"));
const schema_1 = __importDefault(require("./middleware/schema"));
const not_found_1 = __importDefault(require("./controllers/not-found"));
const sanitize_query_1 = __importDefault(require("./middleware/sanitize-query"));
const check_ip_1 = require("./middleware/check-ip");
const exceptions_1 = require("./exceptions");
const extensions_2 = require("./extensions");
const webhooks_2 = require("./webhooks");
const emitter_1 = __importDefault(require("./emitter"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function createApp() {
    return __awaiter(this, void 0, void 0, function* () {
        validate_env_1.validateEnv(['KEY', 'SECRET']);
        yield database_1.validateDBConnection();
        if ((yield database_1.isInstalled()) === false) {
            logger_1.default.fatal(`Database doesn't have Directus tables installed.`);
            process.exit(1);
        }
        const app = express_1.default();
        const customRouter = express_1.default.Router();
        app.disable('x-powered-by');
        app.set('trust proxy', true);
        app.use(express_pino_logger_1.default({ logger: logger_1.default }));
        app.use((req, res, next) => {
            body_parser_1.default.json()(req, res, (err) => {
                if (err) {
                    return next(new exceptions_1.InvalidPayloadException(err.message));
                }
                return next();
            });
        });
        app.use(body_parser_1.default.json());
        app.use(extract_token_1.default);
        app.use((req, res, next) => {
            res.setHeader('X-Powered-By', 'Directus');
            next();
        });
        if (env_1.default.CORS_ENABLED === true) {
            app.use(cors_1.default);
        }
        const _publicUrl = env_1.default.PUBLIC_URL.endsWith('/') ? env_1.default.PUBLIC_URL.substr(0, env_1.default.PUBLIC_URL - 1) : env_1.default.PUBLIC_URL;
        if (!('DIRECTUS_DEV' in process.env)) {
            const adminPath = require.resolve('@directus/app/dist/index.html');
            const publicUrl = env_1.default.PUBLIC_URL.endsWith('/') ? env_1.default.PUBLIC_URL : env_1.default.PUBLIC_URL + '/';
            // Prefix all href/src in the index html with the APIs public path
            let html = fs_extra_1.default.readFileSync(adminPath, 'utf-8');
            html = html.replace(/href="\//g, `href="${publicUrl}`);
            html = html.replace(/src="\//g, `src="${publicUrl}`);
            app.get(_publicUrl + '/', (req, res) => res.redirect(`./admin/`));
            app.get(_publicUrl + '/admin', (req, res) => res.send(html));
            app.use(_publicUrl + '/admin', express_1.default.static(path_1.default.join(adminPath, '..')));
            app.use(_publicUrl + '/admin/*', (req, res) => {
                res.send(html);
            });
        }
        // use the rate limiter - all routes for now
        if (env_1.default.RATE_LIMITER_ENABLED === true) {
            app.use(rate_limiter_1.default);
        }
        app.use(authenticate_1.default);
        app.use(check_ip_1.checkIP);
        app.use(sanitize_query_1.default);
        app.use(cache_1.default);
        app.use(schema_1.default);
        app.use(_publicUrl + '/auth', auth_1.default);
        app.use(_publicUrl + '/graphql', graphql_1.default);
        app.use(_publicUrl + '/activity', activity_1.default);
        app.use(_publicUrl + '/assets', assets_1.default);
        app.use(_publicUrl + '/collections', collections_1.default);
        app.use(_publicUrl + '/extensions', extensions_1.default);
        app.use(_publicUrl + '/fields', fields_1.default);
        app.use(_publicUrl + '/files', files_1.default);
        app.use(_publicUrl + '/folders', folders_1.default);
        app.use(_publicUrl + '/items', items_1.default);
        app.use(_publicUrl + '/permissions', permissions_1.default);
        app.use(_publicUrl + '/presets', presets_1.default);
        app.use(_publicUrl + '/relations', relations_1.default);
        app.use(_publicUrl + '/revisions', revisions_1.default);
        app.use(_publicUrl + '/roles', roles_1.default);
        app.use(_publicUrl + '/server/', server_1.default);
        app.use(_publicUrl + '/settings', settings_1.default);
        app.use(_publicUrl + '/users', users_1.default);
        app.use(_publicUrl + '/utils', utils_1.default);
        app.use(_publicUrl + '/webhooks', webhooks_1.default);
        app.use(_publicUrl + '/custom', customRouter);
        app.use(not_found_1.default);
        app.use(error_handler_1.default);
        // Register all webhooks
        yield webhooks_2.register();
        // Register custom hooks / endpoints
        yield extensions_2.registerExtensions(customRouter);
        track_1.track('serverStarted');
        emitter_1.default.emit('init.before', { app });
        emitter_1.default.emitAsync('init').catch((err) => logger_1.default.warn(err));
        return app;
    });
}
exports.default = createApp;
