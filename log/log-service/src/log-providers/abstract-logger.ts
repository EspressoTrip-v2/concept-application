export abstract class AbstractLogger<T> {
    protected m_logger: T | undefined;
    abstract createLog(logData: Record<string, any>): void;
}
