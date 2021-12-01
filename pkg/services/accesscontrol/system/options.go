package system

import (
	"context"
)

type ResourceValidator func(ctx context.Context, orgID int64, resourceID string) error

type Options struct {
	// Resource is the action and scope prefix that is generated
	Resource string
	// ResourceValidator is a validator function that will be called before each assignment.
	// If set to nil the validator will be skipped
	ResourceValidator ResourceValidator
	// Assignments decides what we can assign permissions to (users/teams/builtInRoles)
	Assignments Assignments
	// PermissionsToAction is a map of friend named permissions and what access control actions they should generate.
	// E.g. Edit permissions should generate dashboards:read, dashboards:write and dashboards:delete
	PermissionsToActions map[string][]string
}
