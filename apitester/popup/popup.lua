local monarch = require "monarch.monarch"

local M = {}

function M.show(text)
	monarch.show(hash("popup"), nil, { text = text })
end

function M.success_check(success, success_text, error_text)
	if success then
		M.show(success_text or "Success!")
	else
		M.show(error_text or "Error!")
	end
end


return M