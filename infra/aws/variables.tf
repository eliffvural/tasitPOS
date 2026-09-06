variable "aws_region" {
  type    = string
  default = "eu-central-1"
}
variable "environment" {
  type    = string
  default = "production"
}
variable "document_bucket_name" { type = string }
variable "audit_bucket_name" { type = string }
variable "certificate_arn" { type = string }
variable "hosted_zone_id" { type = string }
variable "domain_name" { type = string }
variable "alarm_email" { type = string }
variable "alarm_phone_e164" {
  type        = string
  default     = ""
  description = "Optional E.164 SMS destination, for example +905xxxxxxxxx"
}
variable "container_image" {
  type        = string
  description = "Immutable ECR image URI for the TaşıtPOS application"
}
variable "task_cpu" {
  type    = number
  default = 512
}
variable "task_memory" {
  type    = number
  default = 1024
}
variable "desired_count" {
  type    = number
  default = 2
}
variable "application_environment" {
  type        = map(string)
  default     = {}
  description = "Non-secret ECS application environment values"
}
variable "application_secrets" {
  type        = map(string)
  default     = {}
  description = "ECS environment name to Secrets Manager/SSM valueFrom ARN mapping"
}
variable "application_secret_arns" {
  type        = list(string)
  default     = []
  description = "Secrets Manager or SSM ARNs the ECS execution role may read"
}
variable "db_instance_class" {
  type    = string
  default = "db.t4g.small"
}
