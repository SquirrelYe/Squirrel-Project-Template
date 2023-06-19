/**
 * @author SquirrelYe <will@aesen.cc>
 * @description 抽离通用Http状态码，
 * @time 2022.01.14
 */
class HttpStatusConstant {
  /**
   * @description 相关状态码第一位表意：
   * @param 1 表示消息
   * @param 2 表示成功
   * @param 3 表示重定向
   * @param 4 表示请求错误
   * @param 5 表示服务器错误
   */

  /**
   * @description 100区间，代表请求已被接受，需要继续处理。这类响应是临时响应，只包含状态行和某些可选的响应头信息，并以空行结束。
   */
  public static readonly SC_CONTINUE = 100;
  public static readonly SC_SWITCHING_PROTOCOLS = 101;
  public static readonly SC_PROCESSING = 102;

  /**
   * @description 200区间，代表请求已成功被服务器接收、理解、并接受。
   */
  public static readonly SC_OK = 200;
  public static readonly SC_CREATED = 201;
  public static readonly SC_ACCEPTED = 202;
  public static readonly SC_NON_AUTHORITATIVE_INFORMATION = 203;
  public static readonly SC_NO_CONTENT = 204;
  public static readonly SC_RESET_CONTENT = 205;
  public static readonly SC_PARTIAL_CONTENT = 206;
  public static readonly SC_MULTI_STATUS = 207;

  /**
   * @description 300区间，表示要完成请求，需要进一步操作。 通常，这些状态代码用来重定向。
   */
  public static readonly SC_MULTIPLE_CHOICES = 300;
  public static readonly SC_MOVED_PERMANENTLY = 301;
  public static readonly SC_MOVED_TEMPORARILY = 302;
  public static readonly SC_SEE_OTHER = 303;
  public static readonly SC_NOT_MODIFIED = 304;
  public static readonly SC_USE_PROXY = 305;
  public static readonly SC_TEMPORARY_REDIRECT = 307;

  /**
   * @description 400区间，代表了客户端看起来可能发生了错误，妨碍了服务器的处理。
   */
  public static readonly SC_BAD_REQUEST = 400;
  public static readonly SC_UNAUTHORIZED = 401;
  public static readonly SC_PAYMENT_REQUIRED = 402;
  public static readonly SC_FORBIDDEN = 403;
  public static readonly SC_NOT_FOUND = 404;
  public static readonly SC_METHOD_NOT_ALLOWED = 405;
  public static readonly SC_NOT_ACCEPTABLE = 406;
  public static readonly SC_PROXY_AUTHENTICATION_REQUIRED = 407;
  public static readonly SC_REQUEST_TIMEOUT = 408;
  public static readonly SC_CONFLICT = 409;
  public static readonly SC_GONE = 410;
  public static readonly SC_LENGTH_REQUIRED = 411;
  public static readonly SC_PRECONDITION_FAILED = 412;
  public static readonly SC_REQUEST_TOO_LONG = 413;
  public static readonly SC_REQUEST_URI_TOO_LONG = 414;
  public static readonly SC_UNSUPPORTED_MEDIA_TYPE = 415;
  public static readonly SC_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
  public static readonly SC_EXPECTATION_FAILED = 417;
  public static readonly SC_INSUFFICIENT_SPACE_ON_RESOURCE = 419;
  public static readonly SC_METHOD_FAILURE = 420;
  public static readonly SC_UNPROCESSABLE_ENTITY = 422;
  public static readonly SC_LOCKED = 423;
  public static readonly SC_FAILED_DEPENDENCY = 424;

  /**
   * @description 500区间，表示服务器无法完成明显有效的请求。这类状态码代表了服务器在处理请求的过程中有错误或者异常状态发生。
   */
  public static readonly SC_INTERNAL_SERVER_ERROR = 500;
  public static readonly SC_NOT_IMPLEMENTED = 501;
  public static readonly SC_BAD_GATEWAY = 502;
  public static readonly SC_SERVICE_UNAVAILABLE = 503;
  public static readonly SC_GATEWAY_TIMEOUT = 504;
  public static readonly SC_HTTP_VERSION_NOT_SUPPORTED = 505;
  public static readonly SC_INSUFFICIENT_STORAGE = 507;
}

export { HttpStatusConstant };
