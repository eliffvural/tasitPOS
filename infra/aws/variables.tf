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
variable "db_instance_class" {
  type    = string
  default = "db.t4g.small"
}
