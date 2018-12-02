local M = {}

local get_baseurl_js = [[
function get_baseurl() {
	var protocol = window.location.protocol;
	var host = window.location.host;
	var path = window.location.pathname.replace(/[^\/]*$/, '');
	return protocol + "//" + host + path;
}
get_baseurl();
]]

local base_url = nil

function M.get()
	if not base_url then
		base_url = html5.run(get_baseurl_js)
	end
	return base_url
end

return M