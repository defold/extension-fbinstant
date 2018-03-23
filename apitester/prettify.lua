local M = {}

local INDENT = "  "

function M.prettify(t, indentation)
	indentation = indentation or ""
	local s = ""
	if type(t) == "table" then
		if not next(t) then
			s = ("%s{\n%s}"):format(indentation, indentation)
		else
			s = indentation .. "{\n"
			for k,v in pairs(t) do
				if type(v) == "table" then
					s = s .. ("%s%s%s = \n%s,\n"):format(indentation, INDENT, tostring(k), M.prettify(v, indentation .. INDENT))
				else
					s = s .. ("%s%s%s = %s,\n"):format(indentation, INDENT, tostring(k), tostring(v))
				end
			end
			s = s .. indentation .. "}"
		end
	else
		s = indentation .. tostring(t)
	end
	return s
end


return setmetatable(M, {
	__call = function(t, ...)
		return M.prettify(...)
	end
})